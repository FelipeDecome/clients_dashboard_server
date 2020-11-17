import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateRelationClientPhones1605637756832
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'phones',
      new TableForeignKey({
        name: 'PhonesClient',
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('phones', 'PhonesClient');
  }
}
