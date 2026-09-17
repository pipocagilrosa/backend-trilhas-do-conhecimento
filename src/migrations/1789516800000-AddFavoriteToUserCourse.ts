import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona a coluna "favorite" em user_course.
 *
 * A coluna já existia no banco antes desta migration, criada manualmente /
 * pelo synchronize, e por isso todos os passos são idempotentes: a migration
 * pode rodar em um banco que já tem a coluna sem quebrar.
 */
export class AddFavoriteToUserCourse1789516800000 implements MigrationInterface {
  name = 'AddFavoriteToUserCourse1789516800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_course" ADD COLUMN IF NOT EXISTS "favorite" boolean`,
    );
    await queryRunner.query(
      `UPDATE "user_course" SET "favorite" = false WHERE "favorite" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_course" ALTER COLUMN "favorite" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_course" ALTER COLUMN "favorite" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_course" DROP COLUMN IF EXISTS "favorite"`,
    );
  }
}
