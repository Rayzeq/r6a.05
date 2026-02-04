'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.createTable('film', (table) => {
            table.increments('id').primary();
            table.string('title').notNull();
            table.text('description');
            table.date('releaseDate');
            table.string('director').notNull();
            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });

        await knex.schema.createTable('favorite_film', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().notNull().references('id').inTable('user').onDelete('CASCADE');
            table.integer('filmId').unsigned().notNull().references('id').inTable('film').onDelete('CASCADE');
            table.unique(['userId', 'filmId']);
            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('favorite_film');
        await knex.schema.dropTableIfExists('film');
    }
};