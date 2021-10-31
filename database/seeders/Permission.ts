import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Action from 'App/Models/Action'
import Permission from 'App/Models/Permission'
import PermissionDependency from 'App/Models/PermissionDependency'
import Resource from 'App/Models/Resource'

enum Actions {
  MENU = 'menu',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DEACTIVATE = 'deactivate',
  ACTIVATE = 'activate',
  DELETE = 'delete',
}

enum Resources {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
}

interface PermissionData {
  name: Resources
  actions: Array<{
    name: Actions
    dependencies?: Array<{
      name: Resources
      action: Actions
    }>
  }>
  dependencies?: PermissionData[]
}

export default class PermissionSeeder extends BaseSeeder {
  private readonly actions = Actions
  private readonly resources = Resources

  private permissions: PermissionData[] = [
    {
      name: Resources.PERMISSIONS,
      actions: [{ name: Actions.READ }],
    },
    {
      name: Resources.ROLES,
      actions: [
        {
          name: Actions.READ,
          dependencies: [{ name: Resources.PERMISSIONS, action: Actions.READ }],
        },
        {
          name: Actions.MENU,
          dependencies: [
            { name: Resources.ROLES, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
          ],
        },
        {
          name: Actions.CREATE,
          dependencies: [
            { name: Resources.ROLES, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
          ],
        },
        {
          name: Actions.UPDATE,
          dependencies: [
            { name: Resources.ROLES, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
          ],
        },
        {
          name: Actions.ACTIVATE,
          dependencies: [
            { name: Resources.ROLES, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
          ],
        },
        {
          name: Actions.DEACTIVATE,
          dependencies: [
            { name: Resources.ROLES, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
          ],
        },
        {
          name: Actions.DELETE,
          dependencies: [
            { name: Resources.ROLES, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
          ],
        },
      ],
    },
    {
      name: Resources.USERS,
      actions: [
        {
          name: Actions.READ,
          dependencies: [
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
        {
          name: Actions.MENU,
          dependencies: [
            { name: Resources.USERS, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
        {
          name: Actions.CREATE,
          dependencies: [
            { name: Resources.USERS, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
        {
          name: Actions.UPDATE,
          dependencies: [
            { name: Resources.USERS, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
        {
          name: Actions.ACTIVATE,
          dependencies: [
            { name: Resources.USERS, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
        {
          name: Actions.DEACTIVATE,
          dependencies: [
            { name: Resources.USERS, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
        {
          name: Actions.DELETE,
          dependencies: [
            { name: Resources.USERS, action: Actions.READ },
            { name: Resources.PERMISSIONS, action: Actions.READ },
            { name: Resources.ROLES, action: Actions.READ },
          ],
        },
      ],
    },
  ]

  public async run() {
    const actions: Action[] = []
    const resources: Resource[] = []

    for (let item of Object.values(this.actions)) {
      const action = new Action()
      action.name = item
      await action.save()
      actions.push(action)
    }

    for (let item of Object.values(this.resources)) {
      const resource = new Resource()
      resource.name = item
      await resource.save()
      resources.push(resource)
    }

    for (let p of this.permissions) {
      const resource = resources.find((item) => item.name === p.name) as Resource

      for (let a of p.actions) {
        const action = actions.find((item) => item.name === a.name) as Action
        const permission = new Permission()
        permission.resourceId = resource.id
        permission.actionId = action.id
        await permission.save()

        if (!a.dependencies?.length) continue

        for (let d of a.dependencies) {
          const action = actions.find((item) => item.name === d.action) as Action
          const resource = resources.find((item) => item.name === d.name) as Resource
          const dependency = new PermissionDependency()
          dependency.actionId = action.id
          dependency.resourceId = resource.id
          dependency.permissionId = permission.id
          await dependency.save()
        }
      }
    }
  }
}
