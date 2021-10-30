import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'

export const hasPermission = async (
  resource: string,
  action: string,
  user: User
): Promise<boolean> => {
  const permission = await Permission.query()
    .whereHas('roles', (query) => {
      query.whereHas('users', (query) => query.where('users.id', user.id))
    })
    .join('permission_dependencies', 'permissions.id', 'permission_dependencies.permission.id')
    .leftJoin('resources', (query) => {
      query.on('resources.name', resource).andOn((query) => {
        query
          .on('resources.id', 'permissions.resource_id')
          .orOn('resources.id', 'permission_dependencies.resource_id')
      })
    })
    .leftJoin('actions', (query) => {
      query.on('actions.name', action).andOn((query) => {
        query
          .on('actions.id', 'permissions.action_id')
          .orOn('actions.id', 'permission_dependencies.action_id')
      })
    })
    .select('permissions.id as id')
    .limit(1)
    .exec()

  Logger.info('Permission: ', permission)
  return !!permission.length
}
