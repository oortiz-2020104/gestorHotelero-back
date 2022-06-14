'use strict'
const app = require('./configs/app');
const mongo = require('./configs/mongoConfig');
const port = 3200;

mongo.init();
app.listen(port, async () => {
    console.log(`Conectado al puerto ${port}`)
});