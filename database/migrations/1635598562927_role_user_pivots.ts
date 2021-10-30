import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RoleUserPivots extends BaseSchema {
  protected tableName = 'role_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('role_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
