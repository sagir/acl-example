import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import { LoginResponse } from 'App/Responses/LoginResponse'

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
}
