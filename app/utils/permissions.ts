import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

export const hasPermission = (resource: string, action: string, user: User): boolean => {
  return false
}
