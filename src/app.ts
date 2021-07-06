import express, { Application } from 'express';

const app: Application = express();

app.use('/api',
    require('./routes/basic.routes')
);

app.listen(3000, () => console.log('Server running'))

