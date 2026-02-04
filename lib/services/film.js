'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FilmService extends Service {
    async create(filmData) {
        const { Film } = this.server.models();
        return await Film.query().insertAndFetch(filmData);
    }

    async list() {
        const { Film } = this.server.models();
        return await Film.query();
    }

    async getById(id) {
        const { Film } = this.server.models();
        return await Film.query().findById(id);
    }

    async update(id, film) {
        const { Film } = this.server.models();
        return await Film.query().findById(id).patch(film);
    }

    async delete(id) {
        const { Film } = this.server.models();
        return await Film.query().deleteById(id);
    }
};