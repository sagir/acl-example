import User from 'App/Models/User'

export class UserService {
  public static getUsersList({ id }: User, active: boolean = true): Promise<User[]> {
    return User.query()
      .withScopes((query) => (active ? query.active() : query.inactive()))
      .andWhereNot('id', id)
      .orderBy('name', 'asc')
      .exec()
  }
}
