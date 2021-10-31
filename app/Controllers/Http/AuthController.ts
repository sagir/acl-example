import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import { LoginResponse } from 'App/Responses/LoginResponse'
import Database from '@ioc:Adonis/Lucid/Database'
import { PermissionResponse } from 'App/Responses/PermissionsResponse'

export default class AuthController {
  public async login({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<LoginResponse | void> {
    await request.validate(LoginValidator)
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.findBy('email', email)

      if (user && (await Hash.verify(user.password, password))) {
        const token = await auth.use('api').generate(user)
        return { user, token }
      }
    } catch (error) {
      return response.internalServerError({ message: 'Something went wrong. Please try again.' })
    }

    return response.badRequest({ message: 'Invalid credentials.' })
  }

  public async logout({ auth, response }: HttpContextContract): Promise<void> {
    try {
      await auth.use('api').revoke()
      return response.noContent()
    } catch (error) {
      return response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  public async permissions({ auth }: HttpContextContract): Promise<PermissionResponse[]> {
    const { id } = auth.use('api').user as User

    const permissions: any = await Database.from('permissions')
      .whereExists((query) => {
        query
          .from('permission_role')
          .whereColumn('permissions.id', 'permission_role.permission_id')
          .whereExists((query) => {
            query
              .from('role_user')
              .whereColumn('permission_role.role_id', 'role_user.role_id')
              .andWhere('user_id', id)
              .limit(1)
          })
          .limit(1)
      })
      .join('resources', 'permissions.resource_id', 'resources.id')
      .join('actions', 'permissions.action_id', 'actions.id')
      .select('permissions.id as id')
      .select('resources.name as resource')
      .select('actions.name as action')
      .orderBy('resource', 'asc')
      .orderBy('action', 'asc')
      .exec()

    return permissions as PermissionResponse[]
  }
}
