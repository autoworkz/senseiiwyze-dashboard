"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Account {
  id: string
  name: string
  type: "personal" | "team"
  email?: string
  avatar?: string
  role?: string
}

interface AccountSwitcherProps {
  accounts: Account[]
  currentAccount: Account
  onAccountChange: (account: Account) => void
  onManageAccounts?: () => void
  onCreateTeam?: () => void
  className?: string
}

export function AccountSwitcher({
  accounts,
  currentAccount,
  onAccountChange,
  onManageAccounts,
  onCreateTeam,
  className,
}: AccountSwitcherProps) {
  const [open, setOpen] = useState(false)

  const personalAccounts = accounts.filter((account) => account.type === "personal")
  const teamAccounts = accounts.filter((account) => account.type === "team")

  const getAccountInitials = (account: Account) => {
    return account.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAccountSelect = (account: Account) => {
    onAccountChange(account)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select account"
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-6 w-6">
              <AvatarImage src={currentAccount.avatar} alt={currentAccount.name} />
              <AvatarFallback className="text-xs">
                {getAccountInitials(currentAccount)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-medium truncate">
                {currentAccount.name}
              </span>
              {currentAccount.type === "team" && currentAccount.role && (
                <span className="text-xs text-muted-foreground truncate">
                  {currentAccount.role}
                </span>
              )}
              {currentAccount.type === "personal" && currentAccount.email && (
                <span className="text-xs text-muted-foreground truncate">
                  {currentAccount.email}
                </span>
              )}
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search accounts..." />
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            
            {personalAccounts.length > 0 && (
              <CommandGroup heading="Personal Account">
                {personalAccounts.map((account) => (
                  <CommandItem
                    key={account.id}
                    onSelect={() => handleAccountSelect(account)}
                    className="flex items-center gap-2 p-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={account.avatar} alt={account.name} />
                      <AvatarFallback className="text-xs">
                        {getAccountInitials(account)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {account.name}
                      </span>
                      {account.email && (
                        <span className="text-xs text-muted-foreground truncate">
                          {account.email}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentAccount.id === account.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {teamAccounts.length > 0 && (
              <>
                {personalAccounts.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Teams">
                  {teamAccounts.map((account) => (
                    <CommandItem
                      key={account.id}
                      onSelect={() => handleAccountSelect(account)}
                      className="flex items-center gap-2 p-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={account.avatar} alt={account.name} />
                        <AvatarFallback className="text-xs">
                          {getAccountInitials(account)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {account.name}
                        </span>
                        {account.role && (
                          <span className="text-xs text-muted-foreground truncate">
                            {account.role}
                          </span>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentAccount.id === account.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />
            <CommandGroup>
              {onCreateTeam && (
                <CommandItem onSelect={onCreateTeam} className="flex items-center gap-2 p-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Create team</span>
                </CommandItem>
              )}
              {onManageAccounts && (
                <CommandItem onSelect={onManageAccounts} className="flex items-center gap-2 p-2">
                  <Settings className="h-4 w-4 ml-1" />
                  <span className="text-sm">Manage accounts</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}