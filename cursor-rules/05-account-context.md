# Account Context Rules

## Multi-Account Support

The application implements multi-account support (personal vs team accounts).

### Key Considerations

1. **Account Context Visibility**
   - Always show which account context is active
   - Account switcher should be prominent in the UI
   - Use clear visual indicators for current account

2. **Form and Action Clarity**
   - Forms must clearly indicate which account they affect
   - Actions should specify the target account
   - Use confirmation dialogs for critical actions

3. **UI Implementation**
   ```tsx
   // ✅ Good - Shows account context
   <div className="bg-card p-4 rounded-lg border">
     <div className="flex items-center justify-between mb-4">
       <h2 className="text-lg font-semibold text-foreground">Settings</h2>
       <AccountSwitcher currentAccount={currentAccount} />
     </div>
     <p className="text-muted-foreground mb-4">
       Managing settings for: {currentAccount.name}
     </p>
     {/* Form content */}
   </div>
   ```

4. **Confirmation Dialogs**
   ```tsx
   // ✅ Good - Clear account context in confirmations
   <ConfirmDialog
     title="Delete Project"
     message={`Are you sure you want to delete this project from ${currentAccount.name}? This action cannot be undone.`}
     onConfirm={() => handleDelete(projectId, currentAccount.id)}
   />
   ```

### Account State Management
- Store current account in Zustand store
- Provide account switching functionality
- Persist account preference in localStorage
- Handle account-specific data loading 