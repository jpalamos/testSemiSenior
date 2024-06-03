const config = {
  JWTSecret: process.env.BOSTONGYM_JWT_SECRET,
  ExpiresIn: process.env.BOSTONGYM_EXPIRESIN,
  KeyRegister: process.env.BOSTONGYM_KEY_REGISTER,
  port: process.env.BOSTONGYM_PORT,
  dbConfig: {
    port: process.env.BOSTONGYM_DB_PORT,
    dialect: process.env.BOSTONGYM_DB_DIALECT,
    database: process.env.BOSTONGYM_DB_DATABASE,
    username: process.env.BOSTONGYM_DB_USERNAME,
    password: process.env.BOSTONGYM_DB_PASSWORD,
    host: process.env.BOSTONGYM_DB_HOST,
    timezone: process.env.BOSTONGYM_DB_TIMEZONE,
    useUTC: process.env.BOSTONGYM_DB_USEUTC ? process.env.BOSTONGYM_DB_USEUTC : true,
    schema: process.env.BOSTONGYM_DB_SCHEMA,
  }
}
module.exports = config
