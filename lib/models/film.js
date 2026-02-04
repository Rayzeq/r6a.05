'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Film extends Model {
    static get tableName() {
        return 'film';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).max(255).required().example('The Matrix').description('Title of the film'),
            description: Joi.string().allow('').max(1000).example('A computer programmer discovers that reality is a simulation').description('Description of the film'),
            releaseDate: Joi.date().iso().allow(null).example('1999-03-31').description('Release date of the film'),
            director: Joi.string().min(1).max(255).required().example('Lana Wachowski, Lilly Wachowski').description('Director(s) of the film'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};