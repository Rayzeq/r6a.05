'use strict';

const Nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class EmailService extends Service {
    constructor(...args) {
        super(...args);

        this.transporter = Nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true' ? true : false,
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || ''
            }
        });
    }

    async sendMail(to, subject, html) {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Projet JS" <noreply@projet-js.com>',
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html
        };

        return await this.transporter.sendMail(mailOptions);
    }

    async sendWelcomeEmail(user) {
        const html = `
            <h1>Bienvenue sur le projet JavaScript, ${user.firstName} ${user.lastName} !</h1>
        `;

        return await this.sendMail(
            user.email,
            'Bienvenue sur le projet JavaScript',
            html
        );
    }

    async sendNewFilmNotification(film, userEmails) {
        const html = `
            <h1>Nouveau film disponible !</h1>
            <h2>${film.title}</h2>
            <p><strong>Description</strong>: ${film.description}</p>
            <p><strong>Date de sortie</strong>: ${film.releaseDate ? new Date(film.releaseDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Réalisateur</strong>: ${film.director}</p>
        `;

        return await this.sendMail(
            userEmails,
            `Nouveau film ajouté: ${film.title}`,
            html
        );
    }

    async sendFilmUpdateNotification(film, userEmails) {
        const html = `
            <h1>Film mis à jour !</h1>
            <h2>${film.title}</h2>
            <p><strong>Description</strong>: ${film.description}</p>
            <p><strong>Date de sortie</strong>: ${film.releaseDate ? new Date(film.releaseDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Réalisateur</strong>: ${film.director}</p>
        `;

        return await this.sendMail(
            userEmails,
            `Film mis à jour: ${film.title}`,
            html
        );
    }
};