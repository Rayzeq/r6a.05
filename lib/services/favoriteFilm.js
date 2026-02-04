'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteFilmService extends Service {
    async addFavorite(userId, filmId) {
        const { FavoriteFilm } = this.server.models();
        
        try {
            const favorite = await FavoriteFilm.query().insert({
                userId: userId,
                filmId: filmId
            });
            
            return favorite;
        } catch (error) {
            if (error.errno === 1062 || error.constraint) {
                throw Boom.conflict(`Film with id ${filmId} is already in your favorites`);
            }
            throw error;
        }
    }

    async removeFavorite(userId, filmId) {
        const { FavoriteFilm } = this.server.models();
        
        const deletedCount = await FavoriteFilm.query()
            .delete()
            .where('userId', userId)
            .andWhere('filmId', filmId);
        
        if (deletedCount === 0) {
            throw Boom.conflict(`Film with id ${filmId} is not in your favorites`);
        }
        
        return deletedCount;
    }

    async getUserFavorites(userId) {
        const { FavoriteFilm } = this.server.models();

        return (
            await FavoriteFilm.query()
                .withGraphFetched('film')
                .where('userId', userId)
        ).map(fav => fav.film);
    }
};