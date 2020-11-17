import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { created_at, defaultVarcharColumn, id, updated_at } from './utils';

export default class CreateAddresses1605624545792
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          id,
          {
            name: 'client_id',
            type: 'uuid',
          },
          defaultVarcharColumn({
            name: 'street',
          }),
          defaultVarcharColumn({
            name: 'number',
          }),
          defaultVarcharColumn({
            name: 'neighborhood',
          }),
          defaultVarcharColumn({
            name: 'complement',
            isNullable: true,
          }),
          defaultVarcharColumn({
            name: 'cep',
          }),
          defaultVarcharColumn({
            name: 'city',
          }),
          defaultVarcharColumn({
            name: 'state',
          }),
          created_at,
          updated_at,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
