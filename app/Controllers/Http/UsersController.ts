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

  public async store(ctx: HttpContextContract): Promise<void> {
    const { bouncer, request, response } = ctx
    await bouncer.with('UserPolicy').authorize('create')
    await request.validate(UserValidator)

    let user = new User()
    const trx = await Database.transaction()

    try {
      user = await UserService.saveUser(user, trx, ctx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({ message: 'Something went wrong. Please try again.' })
    }

    return response.created(user)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<User> {
    await bouncer.with('UserPolicy').authorize('view')
    return await User.findOrFail(params.id)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { bouncer, params, request, response } = ctx
    await bouncer.with('UserPolicy').authorize('update')
    let user = await User.findOrFail(params)
    await request.validate(new UserValidator(ctx, user.id))
    const trx = await Database.transaction()

    try {
      await UserService.saveUser(user, trx, ctx)
      await trx.commit()
    } catch (error) {
      trx.rollback()
      return response.internalServerError({ message: 'Something went wrong. Please try again.' })
    }

    return response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('delete')
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('activate')
    await UserService.updateUserStatus(params.id, true)
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('deactivate')
    await UserService.updateUserStatus(params.id, false)
    return response.noContent()
  }
}
