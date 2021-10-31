import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UsersController.index').as('index')
  Route.post('/', 'UsersController.store').as('store')
})
  .prefix('/api/v1/users')
  .as('api.v1.users')
  .middleware('auth:api')
