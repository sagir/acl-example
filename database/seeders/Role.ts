import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const superUserRole = new Role()
    superUserRole.name = 'Super User'
    superUserRole.slug = 'super-user'
    superUserRole.deletable = false
    await superUserRole.save()

    const permissions = await Permission.query().preload('resource').exec()
    await superUserRole.related('permissions').sync(permissions.map((p) => p.id))

    const managerUserRole = new Role()
    managerUserRole.name = 'Manager'
    managerUserRole.slug = 'manager'
    await managerUserRole.save()
    await managerUserRole
      .related('permissions')
      .sync(permissions.filter(({ resource }) => resource.name === 'roles').map((p) => p.id))
  }
}
