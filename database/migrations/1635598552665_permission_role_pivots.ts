import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionRolePivots extends BaseSchema {
  protected tableName = 'permission_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('permission_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table
        .integer('role_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
