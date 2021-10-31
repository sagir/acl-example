import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.login').as('login')

  Route.group(() => {
    Route.post('/logout', 'AuthController.logout').as('logout')
    Route.get('/permissions', 'AuthController.permissions').as('permissions')
  }).middleware('auth:api')
})
  .prefix('/api/v1/auth')
  .as('api.v1.auth')
