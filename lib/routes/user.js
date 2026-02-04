'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().required().email().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user'),
                    username: Joi.string().required().example('johndoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.list();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
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
            const { userService } = request.services();
            if (await userService.delete(request.params.id) == 0) {
                throw Boom.notFound(`User not found: ${request.params.id}`);
            }
            return '';
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
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
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().email().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().min(8).example('password').description('Password of the user'),
                    username: Joi.string().example('johndoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'patch',
        path: '/user/elevate/{id}',
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
            const { userService } = request.services();

            const user = await userService.getById(request.params.id);
            if (!user) {
                throw Boom.notFound(`No user with id ${request.params.id}`);
            }

            user.scopes = [...new Set([...user.scopes, "admin"])];
            await userService.update(request.params.id, user);

            return "Successfully elevated user";
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().min(8).required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.login(request.payload.email, request.payload.password);
        }
    }
];