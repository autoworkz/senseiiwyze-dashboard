import { userApiService } from '../userApiService'
import { User, UserStatus, UserRole } from '@/stores/users-store'

// Mock fetch globally
global.fetch = jest.fn()

describe('userApiService', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getUsers', () => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        avatar: 'https://example.com/avatar.jpg'
      }
    ]

    it('fetches users successfully', async () => {
      const mockResponse = {
        data: mockUsers,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 1,
          totalPages: 1
        },
        success: true
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await userApiService.getUsers()

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users?page=1&pageSize=10',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('handles API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error', code: '500' })
      } as Response)

      await expect(userApiService.getUsers()).rejects.toThrow('Server error')
    })
  })

  describe('getUserById', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      avatar: 'https://example.com/avatar.jpg'
    }

    it('fetches a single user successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockUser, success: true })
      } as Response)

      const result = await userApiService.getUserById('1')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({ method: 'GET' })
      )
      expect(result).toEqual(mockUser)
    })

    it('handles user not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'User not found', code: '404' })
      } as Response)

      await expect(userApiService.getUserById('999')).rejects.toThrow('User not found')
    })
  })

  describe('createUser', () => {
    const newUser = {
      email: 'new@example.com',
      name: 'New User',
      role: UserRole.USER
    }

    it('creates a user successfully', async () => {
      const createdUser: User = {
        id: '2',
        ...newUser,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-20T00:00:00Z',
        avatar: null
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: createdUser, success: true })
      } as Response)

      const result = await userApiService.createUser(newUser)

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newUser)
        })
      )
      expect(result).toEqual(createdUser)
    })
  })

  describe('updateUser', () => {
    const updateData = {
      name: 'Updated User',
      role: UserRole.ADMIN
    }

    it('updates a user successfully', async () => {
      const updatedUser: User = {
        id: '1',
        email: 'test@example.com',
        ...updateData,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        avatar: 'https://example.com/avatar.jpg'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: updatedUser, success: true })
      } as Response)

      const result = await userApiService.updateUser('1', updateData)

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      )
      expect(result).toEqual(updatedUser)
    })
  })

  describe('deleteUser', () => {
    it('deletes a user successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'User deleted' })
      } as Response)

      await userApiService.deleteUser('1')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  describe('bulk operations', () => {
    it('performs bulk update successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Bulk update completed' })
      } as Response)

      await userApiService.bulkUpdateUsers(['1', '2', '3'], { status: UserStatus.ACTIVE })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/bulk-update',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ 
            ids: ['1', '2', '3'], 
            updates: { status: UserStatus.ACTIVE } 
          })
        })
      )
    })

    it('performs bulk delete successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Bulk delete completed' })
      } as Response)

      await userApiService.bulkDeleteUsers(['1', '2', '3'])

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/bulk-delete',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ ids: ['1', '2', '3'] })
        })
      )
    })
  })
}) 