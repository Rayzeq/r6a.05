'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.json('scopes').defaultTo([]);
        });
    },

    async down(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.dropColumn('scopes');
        });
    }
};