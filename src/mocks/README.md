# Mock Users Data

This directory contains comprehensive mock user data for testing and development purposes.

## Usage

### Import the mock data

```typescript
import { 
  mockUsers, 
  generateMockUser, 
  generateMockUsers,
  mockActiveUsers,
  mockAdminUsers,
  mockUsersByDepartment 
} from '@/mocks/users'
```

### Available Data

#### Static Mock Users
- `mockUsers`: Array of 10 realistic users with different roles, statuses, and departments
- `mockActiveUsers`: Filtered array of only active users
- `mockInactiveUsers`: Filtered array of only inactive users
- `mockSuspendedUsers`: Filtered array of only suspended users
- `mockAdminUsers`: Filtered array of only admin users
- `mockGuestUsers`: Filtered array of only guest users
- `mockUsersWithHighReadiness`: Users with program readiness >= 80
- `mockUsersWithLowReadiness`: Users with program readiness <= 30
- `mockUsersByDepartment`: Users grouped by department

#### Helper Functions
- `generateMockUser(overrides?)`: Generate a single mock user with optional overrides
- `generateMockUsers(count, overrides?)`: Generate multiple mock users with optional overrides

#### Mock Data Objects
- `mockPaginationData`: Sample pagination data
- `mockFilterData`: Sample filter data
- `mockSortingData`: Sample sorting data

## Examples

### Using Static Mock Data

```typescript
// In a test file
import { mockUsers } from '@/mocks/users'

test('should display users correctly', () => {
  render(<UsersTable users={mockUsers} />)
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### Generating Custom Mock Data

```typescript
// Generate a single admin user
const adminUser = generateMockUser({
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  programReadiness: 100
})

// Generate 5 suspended users
const suspendedUsers = generateMockUsers(5, {
  status: UserStatus.SUSPENDED
})
```

### Using Filtered Data

```typescript
// Test with only active users
test('should handle active users', () => {
  render(<UsersTable users={mockActiveUsers} />)
  // All users should be active
})

// Test with users by department
test('should filter by department', () => {
  const engineeringUsers = mockUsersByDepartment.Engineering
  render(<UsersTable users={engineeringUsers} />)
  // All users should be from Engineering department
})
```

## User Data Structure

Each mock user includes:

```typescript
{
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole (ADMIN | USER | GUEST)
  status: UserStatus (ACTIVE | INACTIVE | SUSPENDED)
  programReadiness: number (0-100)
  lastActive: string
  createdAt: string
  metadata: {
    location?: string
    timezone?: string
    preferences: Record<string, any>
    tags: string[]
  }
  department?: string
  completedModules?: number
  totalModules?: number
}
```

## Testing

Run the mock data tests:

```bash
pnpm test -- src/mocks/__tests__/users.test.ts
```

## Benefits

1. **Consistency**: All tests use the same realistic data
2. **Realism**: Data includes various user types, statuses, and departments
3. **Flexibility**: Helper functions allow custom data generation
4. **Maintainability**: Centralized mock data is easy to update
5. **Performance**: No need to generate data in each test 