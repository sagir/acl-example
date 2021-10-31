import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { Actions } from 'App/Enums/Actions'
import { Resources } from 'App/Enums/Resources'
import User from 'App/Models/User'
import { hasPermission } from 'App/utils/permissions'

export default class UserPolicy extends BasePolicy {
  public async view(user: User) {
    return await hasPermission(Resources.USERS, Actions.READ, user)
  }

  public async create(user: User) {
    return await hasPermission(Resources.USERS, Actions.CREATE, user)
  }

  public async update(user: User) {
    return await hasPermission(Resources.USERS, Actions.UPDATE, user)
  }

  public async activate(user: User) {
    return await hasPermission(Resources.USERS, Actions.ACTIVATE, user)
  }

  public async deactivate(user: User) {
    return await hasPermission(Resources.USERS, Actions.DEACTIVATE, user)
  }

  public async delete(user: User) {
    return await hasPermission(Resources.USERS, Actions.DELETE, user)
  }
}
