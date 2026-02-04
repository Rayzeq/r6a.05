'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
            validate: {
                payload: Joi.object({
                    filmId: Joi.number().integer().required().min(1).example(1).description('ID of the film to add to favorites')
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteFilmService } = request.services();
            const userId = request.auth.credentials.id;
            return await favoriteFilmService.addFavorite(userId, request.payload.filmId);
        }
    },
    {
        method: 'delete',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
            validate: {
                payload: Joi.object({
                    filmId: Joi.number().integer().required().min(1).example(1).description('ID of the film to remove from favorites')
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteFilmService } = request.services();
            const userId = request.auth.credentials.id;
            await favoriteFilmService.removeFavorite(userId, request.payload.filmId);
            return '';
        }
    },
    {
        method: 'get',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            }
        },
        handler: async (request, h) => {
            const { favoriteFilmService } = request.services();
            const userId = request.auth.credentials.id;
            return await favoriteFilmService.getFavoriteFilmsByUserId(userId);
        }
    }
];