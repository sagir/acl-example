import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { Actions } from 'App/Enums/Actions'
import { Resources } from 'App/Enums/Resources'
import User from 'App/Models/User'
import { hasPermission } from 'App/utils/permissions'

export default class PermissionPolicy extends BasePolicy {
  public async view(user: User): Promise<boolean> {
    return await hasPermission(Resources.PERMISSIONS, Actions.READ, user)
  }
}
