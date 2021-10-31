import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import { Resources } from 'App/Enums/Resources'
import { Actions } from 'App/Enums/Actions'

export const hasPermission = async (
  resource: Resources,
  action: Actions,
  user: User
): Promise<boolean> => {
  const permission = await Permission.query()
    .whereHas('roles', (query) => {
      query.whereHas('users', (query) => query.where('users.id', user.id))
    })
    .join('permission_dependencies', 'permissions.id', 'permission_dependencies.permission_id')
    .leftJoin('resources', (query) => {
      query
        .on('resources.id', 'permissions.resource_id')
        .orOn('resources.id', 'permission_dependencies.resource_id')
    })
    .leftJoin('actions', (query) => {
      query
        .on('actions.id', 'permissions.action_id')
        .orOn('actions.id', 'permission_dependencies.action_id')
    })
    .where('resources.name', resource)
    .andWhere('actions.name', action)
    .select('permissions.id as id')
    .limit(1)
    .exec()

  Logger.info('Permission: ', permission)
  return !!permission.length
}
