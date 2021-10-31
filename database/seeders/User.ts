import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const superUserRole = await Role.findByOrFail('slug', 'super-user')
    const managerUserRole = await Role.findByOrFail('slug', 'manager')

    const superUser = new User()
    superUser.name = 'Super User'
    superUser.email = 'super@user.com'
    superUser.password = '123456'
    // @ts-ignore
    superUser['isSuperAdmin'] = true
    await superUser.save()
    await superUser.related('roles').attach([superUserRole.id])

    const managerUser = new User()
    managerUser.name = 'Manager'
    managerUser.email = 'manager@user.com'
    managerUser.password = '123456'
    await managerUser.save()
    await managerUser.related('roles').attach([managerUserRole.id])
  }
}
