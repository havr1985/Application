import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772123316366 implements MigrationInterface {
    name = 'Init1772123316366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."visibility_event_enum" AS ENUM('private', 'public')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(100) NOT NULL, "description" text NOT NULL, "date_time" TIMESTAMP WITH TIME ZONE NOT NULL, "location" character varying(200) NOT NULL, "capacity" integer, "visibility" "public"."visibility_event_enum" NOT NULL DEFAULT 'public', "organizer_id" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_participants" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_badb99ed7e07532bba1315a8af5" PRIMARY KEY ("event_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b5349807aae71193d0cc0f52e3" ON "event_participants" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce3f433e47fdd8f072964293c8" ON "event_participants" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_14c9ce53a2c2a1c781b8390123e" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_participants" ADD CONSTRAINT "FK_b5349807aae71193d0cc0f52e35" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_participants" ADD CONSTRAINT "FK_ce3f433e47fdd8f072964293c8d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_participants" DROP CONSTRAINT "FK_ce3f433e47fdd8f072964293c8d"`);
        await queryRunner.query(`ALTER TABLE "event_participants" DROP CONSTRAINT "FK_b5349807aae71193d0cc0f52e35"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_14c9ce53a2c2a1c781b8390123e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce3f433e47fdd8f072964293c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5349807aae71193d0cc0f52e3"`);
        await queryRunner.query(`DROP TABLE "event_participants"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."visibility_event_enum"`);
    }

}
