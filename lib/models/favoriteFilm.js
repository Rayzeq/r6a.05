'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class FavoriteFilm extends Model {
    static get tableName() {
        return 'favorite_film';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            userId: Joi.number().integer().required(),
            filmId: Joi.number().integer().required(),
            createdAt: Joi.date()
        });
    }

    static get relationMappings() {
        const User = require('./user');
        const Film = require('./film');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'favorite_film.userId',
                    to: 'user.id'
                }
            },
            film: {
                relation: Model.BelongsToOneRelation,
                modelClass: Film,
                join: {
                    from: 'favorite_film.filmId',
                    to: 'film.id'
                }
            }
        };
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
    }
};