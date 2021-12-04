
exports.up = async (knex) => {

    var env = process.env.NODE_ENV || 'development'

    if (env == "development") {
        await knex.raw(`CREATE TABLE User (
            id integer PRIMARY KEY AUTOINCREMENT,
            password_hash varchar,
            full_name varchar,
            admin boolean,
            remote_id integer
        );`);
        
        await knex.raw(`
        CREATE TABLE TestResults (
            id integer PRIMARY KEY AUTOINCREMENT,
            user_id integer,
            result text
        );`);
        
        await knex.raw(`
        CREATE TABLE Appointments (
            id integer PRIMARY KEY AUTOINCREMENT,
            user_id integer,
            datetime datetime,
            doctor varchar,
            clinic_id integer
        );`);

        await knex.raw(`
        CREATE TABLE Clinic (
            id integer PRIMARY KEY AUTOINCREMENT,
            name varchar,
            ph_number varchar
        );`);
        
        await knex.raw(`
        CREATE TABLE CMS (
            id integer PRIMARY KEY AUTOINCREMENT,
            page varchar,
            element_id varchar,
            data text,
            attributes text,
            style text
        );`);

        await knex.raw(`
        CREATE TABLE Question (
            id integer PRIMARY KEY AUTOINCREMENT,
            text text
        );`);

        await knex.raw(`
        CREATE TABLE Option (
            id integer PRIMARY KEY AUTOINCREMENT,
            current_question integer,
            next_question integer,
            text text
        );`);
    } else {
        await knex.raw(`CREATE TABLE "public.User" (
            "id" serial NOT NULL UNIQUE,
            "password_hash" varchar(255) NOT NULL,
            "full_name" varchar(255) NOT NULL,
            "admin" BOOLEAN(1) NOT NULL DEFAULT '0',
            "remote_id" integer UNIQUE,
            CONSTRAINT "User_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );



        CREATE TABLE "public.TestResults" (
            "id" serial NOT NULL UNIQUE,
            "user_id" integer NOT NULL,
            "result" TEXT(1000) NOT NULL,
            CONSTRAINT "TestResults_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );



        CREATE TABLE "public.Appointments" (
            "id" serial NOT NULL UNIQUE,
            "user_id" integer NOT NULL,
            "datetime" DATETIME,
            "doctor" varchar(255),
            "clinic_id" integer(255) NOT NULL,
            CONSTRAINT "Appointments_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );



        CREATE TABLE "public.Clinic" (
            "id" serial NOT NULL UNIQUE,
            "name" varchar(255) NOT NULL UNIQUE,
            "ph_number" varchar(255),
            CONSTRAINT "Clinic_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );



        CREATE TABLE "public.CMS" (
            "id" serial NOT NULL UNIQUE,
            "page" varchar(255) NOT NULL,
            "element_id" varchar(255) NOT NULL,
            "data" TEXT(1000),
            "attributes" TEXT(1000),
            "style" TEXT(1000),
            CONSTRAINT "CMS_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );



        CREATE TABLE "public.Question" (
            "id" serial,
            "text" TEXT(1000) NOT NULL,
            CONSTRAINT "Question_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );



        CREATE TABLE "public.Option" (
            "id" serial NOT NULL UNIQUE,
            "current_question" integer NOT NULL,
            "next_question" integer,
            "text" TEXT(1000) NOT NULL,
            CONSTRAINT "Option_pk" PRIMARY KEY ("id")
        ) WITH (
        OIDS=FALSE
        );




        ALTER TABLE "TestResults" ADD CONSTRAINT "TestResults_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("id");

        ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("id");
        ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_fk1" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id");




        ALTER TABLE "Option" ADD CONSTRAINT "Option_fk0" FOREIGN KEY ("current_question") REFERENCES "Question"("id");
        ALTER TABLE "Option" ADD CONSTRAINT "Option_fk1" FOREIGN KEY ("next_question") REFERENCES "Question"("id");


        `);
    }
};

exports.down = function (knex) {
    return knex.schema.dropTable('Appointments').dropTable('CMS').dropTable('Clinic').dropTable('Option').dropTable('Question').dropTable('TestResults').dropTable('User');
};
