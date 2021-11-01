import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export class UserService {
  public static async getUsersList({ id }: User, active: boolean = true): Promise<User[]> {
    return await User.query()
      .withScopes((query) => (active ? query.active() : query.inactive()))
      .andWhereNot('id', id)
      .orderBy('name', 'asc')
      .exec()
  }

  public static async saveUser(
    user: User,
    trx: TransactionClientContract,
    { request }: HttpContextContract
  ): Promise<User> {
    user.name = request.input('name')
    user.email = request.input('email')

    if (!user.id) {
      user.password = request.input('password')
    }

    await user.useTransaction(trx).save()
    await user.related('roles').sync(request.input('roles'), true, trx)
    return user
  }

  public static async updateUserStatus(userId: number, active: boolean): Promise<User> {
    const user = await User.findOrFail(userId)
    user.deactivatedAt = active ? undefined : DateTime.now()
    return await user.save()
  }
}
