import { app } from './app.js'

const port = Number(process.env.PORT) || 3000

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is ready at: http://localhost:${port}`)
})

process.on('uncaughtException', (err) => {
    console.error('Unexpected error:', err);
    server.close(() => {
        process.exit(1);
    })
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received.');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    process.exit(0);
});
