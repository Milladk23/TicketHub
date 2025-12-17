import app from "./app";

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, '127.0.0.1', () => {
    console.log('Server is running...');
});

process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION. We are shutting down...');
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});