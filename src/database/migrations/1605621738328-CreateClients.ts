import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { created_at, defaultVarcharColumn, id, updated_at } from './utils';

export default class CreateClients1605621738328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          id,
          defaultVarcharColumn({
            name: 'name',
          }),
          {
            name: 'main_address_id',
            type: 'uuid',
            isNullable: true,
          },
          created_at,
          updated_at,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients');
  }
}
