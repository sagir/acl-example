/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.login').as('login')

  Route.group(() => {
    Route.post('/logout', 'AuthController.logout').as('logout')
    Route.get('/permissions', 'AuthController.permissions').as('permissions')
  }).middleware('auth:api')
})
  .prefix('/api/v1/auth')
  .as('api.v1')
