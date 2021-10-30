import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Resources extends BaseSchema {
  protected tableName = 'resources'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
