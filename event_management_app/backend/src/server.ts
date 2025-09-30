import build from './app';

const port = Number(process.env.PORT) || 3001;

build()
  .then(app => app.listen({ port, host: '0.0.0.0' }))
  .then(() => console.log(`🚀  Server running on http://0.0.0.0:${port}`))
  .catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
