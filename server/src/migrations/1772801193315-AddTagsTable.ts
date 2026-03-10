import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagsTable1772801193315 implements MigrationInterface {
    name = 'AddTagsTable1772801193315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_tags" ("event_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_0fce1d3dc22d5c2b86d8eb3c035" PRIMARY KEY ("event_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_640b9db5340d03f53d02a4dca1" ON "event_tags" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f80b6bfb86895b578c3083a2e8" ON "event_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "event_tags" ADD CONSTRAINT "FK_640b9db5340d03f53d02a4dca1d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_tags" ADD CONSTRAINT "FK_f80b6bfb86895b578c3083a2e8c" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_tags" DROP CONSTRAINT "FK_f80b6bfb86895b578c3083a2e8c"`);
        await queryRunner.query(`ALTER TABLE "event_tags" DROP CONSTRAINT "FK_640b9db5340d03f53d02a4dca1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f80b6bfb86895b578c3083a2e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_640b9db5340d03f53d02a4dca1"`);
        await queryRunner.query(`DROP TABLE "event_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
