'use client'

export function PlaceholderState({
    title,
    description,
}: {
    title: string
    description?: string
}) {
    return (
        <div className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed bg-muted/10">
            <h3 className="font-medium text-foreground">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
                    {description}
                </p>
            )}
        </div>
    )
} 