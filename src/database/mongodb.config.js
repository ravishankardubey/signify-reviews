const mongoose = require("mongoose");

const ENV = process.env;

const MOGODB_CONFIG = {
    "getConfig": function () {
        return 'mongodb+srv://' + ENV.DB_USER + ':' + ENV.DB_PASS + '@' + ENV.MONGO_DB_ATLAS + '/' + ENV.DB_NAME;
    },

    "getConnection": function () {
        const MONGO_ENDPOINT = this.getConfig();
        const connection = mongoose.connect(MONGO_ENDPOINT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return connection;
    }

};

module.exports = MOGODB_CONFIG;