'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/film',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(1).max(255).required().example('The Matrix').description('Title of the film'),
                    description: Joi.string().allow('').max(1000).example('A computer programmer discovers that reality is a simulation').description('Description of the film'),
                    releaseDate: Joi.date().iso().allow(null).example('1999-03-31').description('Release date of the film'),
                    director: Joi.string().min(1).max(255).required().example('Lana Wachowski, Lilly Wachowski').description('Director(s) of the film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/films',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.list();
        }
    },
    {
        method: 'get',
        path: '/film/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const film = await filmService.getById(request.params.id);
            
            if (!film) {
                throw Boom.notFound(`Film not found: ${request.params.id}`);
            }
            
            return film;
        }
    },
    {
        method: 'put',
        path: '/film/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    title: Joi.string().min(1).max(255).example('The Matrix').description('Title of the film'),
                    description: Joi.string().allow('').max(1000).example('A computer programmer discovers that reality is a simulation').description('Description of the film'),
                    releaseDate: Joi.date().iso().allow(null).example('1999-03-31').description('Release date of the film'),
                    director: Joi.string().min(1).max(255).example('Lana Wachowski, Lilly Wachowski').description('Director(s) of the film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'delete',
        path: '/film/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            if (await filmService.delete(request.params.id) == 0) {
                throw Boom.notFound(`Film not found: ${request.params.id}`);
            }
            return '';
        }
    }
];