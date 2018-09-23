import * as mongoose from 'mongoose';
import { readdirSync } from 'fs';
import { join } from 'path';

// connect to the database via the appmanager database
mongoose.connect('mongodb://localhost/appmanager', {
    useNewUrlParser: true
});

// read and gather all different data models defined in the 
// `/models` directory
readdirSync(join(__dirname, './models')).forEach((model) => {
    if (model.indexOf('.js') > 0 && model.indexOf('.map') < 0)
        require(join(__dirname, `./models/${model}`));
});

// initiates all middleware after the data models have been defined,
// they are split due to dependency checks
readdirSync(join(__dirname, './middleware')).forEach((middleware) => {
    if (middleware.indexOf('.js') > 0 && middleware.indexOf('map') < 0)
        require(join(__dirname, `./middleware/${middleware}`));
});