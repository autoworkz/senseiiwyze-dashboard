import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Account {
  id: string
  name: string
  type: "personal" | "team"
  email?: string
  avatar?: string
  role?: string
}

interface AccountContextStore {
  // Current state
  accounts: Account[]
  currentAccount: Account | null
  
  // Actions
  setCurrentAccount: (account: Account) => void
  addAccount: (account: Account) => void
  removeAccount: (accountId: string) => void
  updateAccount: (accountId: string, updates: Partial<Account>) => void
  initializeWithDefaults: () => void
}

// Default accounts for demo purposes
const defaultAccounts: Account[] = [
  {
    id: "personal-1",
    name: "John Doe",
    type: "personal",
    email: "john@example.com",
  },
  {
    id: "team-1",
    name: "Acme Corp",
    type: "team",
    role: "Admin",
  },
  {
    id: "team-2",
    name: "Design Team",
    type: "team",
    role: "Member",
  },
]

export const useAccountContextStore = create<AccountContextStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      currentAccount: null,

      setCurrentAccount: (account) => {
        set({ currentAccount: account })
      },

      addAccount: (account) => {
        set((state) => ({
          accounts: [...state.accounts, account],
        }))
      },

      removeAccount: (accountId) => {
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== accountId),
          currentAccount: 
            state.currentAccount?.id === accountId 
              ? state.accounts.find((acc) => acc.id !== accountId) || null
              : state.currentAccount,
        }))
      },

      updateAccount: (accountId, updates) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId ? { ...account, ...updates } : account
          ),
          currentAccount:
            state.currentAccount?.id === accountId
              ? { ...state.currentAccount, ...updates }
              : state.currentAccount,
        }))
      },

      initializeWithDefaults: () => {
        const state = get()
        if (state.accounts.length === 0) {
          set({
            accounts: defaultAccounts,
            currentAccount: defaultAccounts[0],
          })
        }
      },
    }),
    {
      name: "account-context-storage",
      partialize: (state) => ({
        accounts: state.accounts,
        currentAccount: state.currentAccount,
      }),
    }
  )
)