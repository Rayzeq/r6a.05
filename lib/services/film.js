'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FilmService extends Service {
    async create(filmData) {
        const { Film } = this.server.models();
        const film = await Film.query().insertAndFetch(filmData);

        try {
            const { emailService, userService } = this.server.services();
            const emails = (await userService.list()).map(user => user.email);

            if (emails.length > 0) {
                await emailService.sendNewFilmNotification(film, emails);
            }
        } catch (error) {
            console.error('Failed to send new film notifications:', error);
        }

        return film;
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
        const { Film, FavoriteFilm } = this.server.models();
        const updatedFilm = await Film.query().patchAndFetchById(id, film);

        if (!updatedFilm) {
            throw Boom.notFound(`Film not found: ${id}`);
        }

        try {
            const { emailService } = this.server.services();
            const favoriteFilms = await FavoriteFilm.query()
                .withGraphFetched('user')
                .where('filmId', id);
            const emails = favoriteFilms.map(fav => fav.user.email);

            if (favoriteFilms.length > 0) {
                await emailService.sendFilmUpdateNotification(updatedFilm, emails);
            }
        } catch (error) {
            console.error('Failed to send film update notifications:', error);
        }

        return updatedFilm;
    }

    async delete(id) {
        const { Film } = this.server.models();
        return await Film.query().deleteById(id);
    }
};