import { defineStore } from 'pinia'

export type Permission =
  | 'dashboard:read'
  | 'campaigns:read'
  | 'campaigns:manage'
  | 'customers:read'
  | 'cashback:read'
  | 'cashback:manage'
  | 'reports:read'
  | 'settings:manage'

const administratorPermissions: Permission[] = [
  'dashboard:read', 'campaigns:read', 'campaigns:manage', 'customers:read',
  'cashback:read', 'cashback:manage', 'reports:read', 'settings:manage',
]

function loadUser(): { name: string; role: 'admin' | 'marketing' } | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('bonix-user') ?? 'null')
    if (typeof value !== 'object' || value === null || !('name' in value) || !('role' in value)) return null
    if (typeof value.name !== 'string' || (value.role !== 'admin' && value.role !== 'marketing')) return null
    return { name: value.name, role: value.role }
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: loadUser() }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
  actions: {
    login(role: 'admin' | 'marketing' = 'admin') {
      this.user = { name: role === 'admin' ? 'Marina Costa' : 'Rafael Lima', role }
      localStorage.setItem('bonix-user', JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('bonix-user')
    },
    hasPermission(permission: string) {
      if (!this.user) return false
      if (this.user.role === 'admin') return administratorPermissions.includes(permission as Permission)
      return ['dashboard:read', 'campaigns:read', 'customers:read', 'cashback:read', 'reports:read'].includes(permission)
    },
  },
})
