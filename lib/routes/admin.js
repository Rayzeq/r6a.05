'use strict';

module.exports = [
    {
        method: 'post',
        path: '/admin/export-csv',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            }
        },
        handler: async (request, h) => {
            const { jobQueueService } = request.services();
            const userEmail = request.auth.credentials.email;

            await jobQueueService.add('csv-export', 'export-films-to-csv', {
                recipientEmail: userEmail
            });

            return {
                message: 'CSV export job has been queued. You will receive an email with the export shortly.',
                status: 'queued'
            };
        }
    }
];