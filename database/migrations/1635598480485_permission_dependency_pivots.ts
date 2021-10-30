import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionDependencyPivots extends BaseSchema {
  protected tableName = 'permission_dependencies'

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
        .integer('depends_on')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
