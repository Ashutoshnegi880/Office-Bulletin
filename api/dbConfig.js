const { Pool } = require("pg");
const Joi = require('joi');
const config = require("../properties.json")

const configSchema = Joi.object({
  PORT: Joi.number().port().default(80),
  pg_user: Joi.string().required(),
  pg_host: Joi.string().required(),
  pg_database: Joi.string().required(),
  pg_password: Joi.string().required(),
  pg_port: Joi.number().port().default(5432),
});


const properties = configSchema.validate(config).value
console.log(properties)
const pool = new Pool({
  user: properties.pg_user,
  host: properties.pg_host,
  database: properties.pg_database,
  password: properties.pg_password,
  port: properties.pg_port,
});
module.exports = pool;