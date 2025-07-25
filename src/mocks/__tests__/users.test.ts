import { mockUsers, generateMockUser, generateMockUsers, mockActiveUsers, mockAdminUsers } from '../users'
import { UserRole, UserStatus } from '@/stores/users-store'

describe('Mock Users Data', () => {
  describe('mockUsers', () => {
    it('should have 10 users', () => {
      expect(mockUsers).toHaveLength(10)
    })

    it('should have users with different roles', () => {
      const roles = mockUsers.map(user => user.role)
      expect(roles).toContain(UserRole.ADMIN)
      expect(roles).toContain(UserRole.USER)
      expect(roles).toContain(UserRole.GUEST)
    })

    it('should have users with different statuses', () => {
      const statuses = mockUsers.map(user => user.status)
      expect(statuses).toContain(UserStatus.ACTIVE)
      expect(statuses).toContain(UserStatus.INACTIVE)
      expect(statuses).toContain(UserStatus.SUSPENDED)
    })

    it('should have realistic user data', () => {
      const firstUser = mockUsers[0]
      expect(firstUser.name).toBe('John Doe')
      expect(firstUser.email).toBe('john.doe@company.com')
      expect(firstUser.role).toBe(UserRole.ADMIN)
      expect(firstUser.status).toBe(UserStatus.ACTIVE)
      expect(firstUser.programReadiness).toBe(95)
    })
  })

  describe('generateMockUser', () => {
    it('should generate a user with default values', () => {
      const user = generateMockUser()
      expect(user.id).toBeDefined()
      expect(user.email).toMatch(/@company\.com$/)
      expect(user.role).toBe(UserRole.USER)
      expect(user.status).toBe(UserStatus.ACTIVE)
      expect(user.programReadiness).toBeGreaterThanOrEqual(0)
      expect(user.programReadiness).toBeLessThanOrEqual(100)
    })

    it('should allow overriding user properties', () => {
      const user = generateMockUser({
        role: UserRole.ADMIN,
        status: UserStatus.SUSPENDED,
        programReadiness: 50
      })
      expect(user.role).toBe(UserRole.ADMIN)
      expect(user.status).toBe(UserStatus.SUSPENDED)
      expect(user.programReadiness).toBe(50)
    })
  })

  describe('generateMockUsers', () => {
    it('should generate the specified number of users', () => {
      const users = generateMockUsers(5)
      expect(users).toHaveLength(5)
    })

    it('should apply overrides to all generated users', () => {
      const users = generateMockUsers(3, { role: UserRole.ADMIN })
      users.forEach(user => {
        expect(user.role).toBe(UserRole.ADMIN)
      })
    })
  })

  describe('filtered mock data', () => {
    it('should have active users', () => {
      expect(mockActiveUsers.length).toBeGreaterThan(0)
      mockActiveUsers.forEach(user => {
        expect(user.status).toBe(UserStatus.ACTIVE)
      })
    })

    it('should have admin users', () => {
      expect(mockAdminUsers.length).toBeGreaterThan(0)
      mockAdminUsers.forEach(user => {
        expect(user.role).toBe(UserRole.ADMIN)
      })
    })
  })
}) 