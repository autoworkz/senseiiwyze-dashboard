"use client"

import * as React from "react"
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  FileText, 
  Archive,
  Music,
  Check,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  Trash2
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn, formatFileSize } from "@/lib/utils"

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
  url?: string | string | URL | undefined
  preview?: string
}

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  onFilesChange: (files: UploadedFile[]) => void
  onUpload?: (files: UploadedFile[]) => Promise<void>
  disabled?: boolean
  className?: string
  showPreview?: boolean
  allowedTypes?: string[]
}

export function FileUpload({
  accept,
  multiple = true,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  onFilesChange,
  onUpload,
  disabled = false,
  className,
  showPreview = true,
  allowedTypes = []
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return 'text-blue-500'
    if (type.startsWith('video/')) return 'text-purple-500'
    if (type.startsWith('audio/')) return 'text-green-500'
    if (type.includes('pdf')) return 'text-red-500'
    if (type.includes('zip') || type.includes('rar')) return 'text-yellow-500'
    return 'text-gray-500'
  }

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
    
    return null
  }

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => resolve(undefined)
        reader.readAsDataURL(file)
      } else {
        resolve(undefined)
      }
    })
  }

  const processFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = []
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      
      // Check if we're exceeding max files
      if (files.length + newFiles.length >= maxFiles) {
        break
      }
      
      const error = validateFile(file)
      const preview = await createFilePreview(file)
      
      const uploadedFile: UploadedFile = {
        id: `${file.name}-${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'pending',
        error: error || undefined,
        preview
      }
      
      newFiles.push(uploadedFile)
    }
    
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const retryUpload = (fileId: string) => {
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, status: 'pending' as const, error: undefined } : f
    )
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleUpload = async () => {
    if (!onUpload) return
    
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return
    
    // Set all pending files to uploading
    const updatedFiles = files.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const, progress: 0 } : f
    )
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    
    try {
      await onUpload(pendingFiles)
      
      // Mark all uploading files as success
      const successFiles = files.map(f => 
        f.status === 'uploading' ? { ...f, status: 'success' as const, progress: 100 } : f
      )
      setFiles(successFiles)
      onFilesChange(successFiles)
    } catch (error) {
      // Mark all uploading files as error
      const errorFiles = files.map(f => 
        f.status === 'uploading' ? { 
          ...f, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      )
      setFiles(errorFiles)
      onFilesChange(errorFiles)
    }
  }

  const clearAll = () => {
    setFiles([])
    onFilesChange([])
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const uploadingCount = files.filter(f => f.status === 'uploading').length
  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver && !disabled ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept ? `Accepted: ${accept}` : 'Any file type'}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles > 1 && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
              {pendingCount > 0 && (
                <Badge variant="secondary">
                  {pendingCount} pending
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge variant="default">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {uploadingCount} uploading
                </Badge>
              )}
              {successCount > 0 && (
                <Badge variant="default" className="bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  {successCount} success
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errorCount} error{errorCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {pendingCount > 0 && onUpload && (
                <Button onClick={handleUpload} size="sm">
                  Upload {pendingCount} file{pendingCount !== 1 ? 's' : ''}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Files */}
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Preview or Icon */}
                    <div className="flex-shrink-0">
                      {showPreview && file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className={cn("h-10 w-10 rounded bg-muted flex items-center justify-center", getFileTypeColor(file.type))}>
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <Badge variant={
                          file.status === 'success' ? 'default' :
                          file.status === 'error' ? 'destructive' :
                          file.status === 'uploading' ? 'default' : 'secondary'
                        }>
                          {file.status === 'uploading' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                          {file.status === 'success' && <Check className="h-3 w-3 mr-1" />}
                          {file.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {file.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        {file.error && (
                          <span className="text-xs text-destructive">{file.error}</span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <Progress value={file.progress} className="mt-2 h-1" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        {file.status === 'success' && file.url && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => window.open(file.url, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View file</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    const a = document.createElement('a')
                                    a.href = file.url!.toString()
                                    a.download = file.name
                                    a.click()
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download file</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                        
                        {file.status === 'error' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => retryUpload(file.id)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Retry upload</TooltipContent>
                          </Tooltip>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => removeFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove file</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Simple File Upload variant for basic use cases
interface SimpleFileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function SimpleFileUpload({
  onFileSelect,
  accept,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  placeholder = "Choose file",
  className
}: SimpleFileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (maxSize && file.size > maxSize) {
      setError(`File size exceeds ${formatFileSize(maxSize)}`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {selectedFile ? selectedFile.name : placeholder}
        </Button>
        {selectedFile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFile(null)
              setError(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      
      {selectedFile && (
        <p className="text-xs text-muted-foreground">
          {formatFileSize(selectedFile.size)}
        </p>
      )}
    </div>
  )
}