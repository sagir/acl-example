import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { UserService } from 'App/Services/UserService'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ auth, bouncer }: HttpContextContract): Promise<User[]> {
    await bouncer.with('UserPolicy').authorize('view')
    return await UserService.getUsersList(auth.use('api').user as User)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('create')
    await request.validate(UserValidator)

    const user = new User()
    user.name = request.input('name')
    user.email = request.input('email')
    user.password = request.input('password')
    const trx = await Database.transaction()

    try {
      await user.useTransaction(trx).save()
      await user.related('roles').attach(request.input('roles'), trx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({ message: 'Something went wrong. Please try again.' })
    }

    return response.created(user)
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
