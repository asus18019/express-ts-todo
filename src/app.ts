import express, { Application } from 'express';
import mongoose from 'mongoose';

const app: Application = express();
const port: number = 3000;

app.use(express.json());

app.use('/api',
    require('./routes/user.routes'),
    require('./routes/car.routes')
);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Admin:11qqaa@cluster0.huyrw.mongodb.net/garbage?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        }).then(() => {
            app.listen(port, () => {
                console.log(`Server has been started on port ${port}...`)
            });
        })
    } catch (e) {
        console.log(e);
    }
}

start()

