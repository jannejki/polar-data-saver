import Knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const knex = Knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_DATABASE
    }
});

export default knex;