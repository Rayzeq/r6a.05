'use strict';

const { Service } = require('@hapipal/schmervice');

class JobQueueService extends Service {
    constructor(...args) {
        super(...args);
        this.queues = new Map();
        this.running = true;
        
        this.startProcessing();
    }

    getQueue(name) {
        if (!this.queues.has(name)) {
            this.queues.set(name, []);
        }
        return this.queues.get(name);
    }

    async add(queueName, jobName, data, options = {}) {
        const queue = this.getQueue(queueName);
        const job = {
            id: Date.now() + Math.random(),
            name: jobName,
            data,
            queue: queueName,
            timestamp: new Date(),
            attempts: 0,
            maxAttempts: options.attempts || 3,
            delay: options.delay || 0,
            created: Date.now()
        };

        if (job.delay > 0) {
            setTimeout(() => {
                queue.push(job);
            }, job.delay);
        } else {
            queue.push(job);
        }

        return job;
    }

    startProcessing() {
        setInterval(async () => {
            if (!this.running) return;
            
            for (const [queueName, queue] of this.queues.entries()) {
                if (queue.length > 0) {
                    const job = queue.shift();
                    await this.processJob(job);
                }
            }
        }, 100);
    }

    async processJob(job) {
        const processor = this.getProcessor(job.queue);
        if (!processor) {
            console.error(`No processor found for queue: ${job.queue}`);
            return;
        }

        try {
            await processor(job);
        } catch (error) {
            job.attempts++;
            if (job.attempts >= job.maxAttempts) {
                console.error(`Job ${job.id} failed after ${job.maxAttempts} attempts:`, error);
            } else {
                console.warn(`Job ${job.id} failed, retrying... (${job.attempts}/${job.maxAttempts})`);
                
                setTimeout(() => {
                    const queue = this.getQueue(job.queue);
                    queue.push(job);
                }, Math.pow(2, job.attempts) * 1000);
            }
        }
    }

    getProcessor(queueName) {
        switch (queueName) {
            case 'csv-export':
                return this.processCSVExport.bind(this);
            default:
                return null;
        }
    }

    async processCSVExport(job) {
        const { emailService, filmService } = this.server.services();
        
        const films = await filmService.list();
        
        let csvContent = 'ID,Title,Description,Release Date,Director,Created At,Updated At\n';
        for (const film of films) {
            csvContent += `"${film.id}","${film.title.replace(/"/g, '""')}","${(film.description || '').replace(/"/g, '""')}","${film.releaseDate || ''}","${film.director.replace(/"/g, '""')}","${film.createdAt || ''}","${film.updatedAt || ''}"\n`;
        }

        const fileName = `film-library-export-${new Date().toISOString().split('T')[0]}.csv`;
        
        await emailService.sendCSVExportEmail(
            job.data.recipientEmail,
            csvContent,
            fileName
        );
    }
    
    stop() {
        this.running = false;
    }
}

module.exports = JobQueueService;