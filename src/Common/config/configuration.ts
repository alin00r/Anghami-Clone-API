export default () => ({
  port: parseInt(process.env.PORT as string) || 3000,
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD as string,
    port: parseInt(process.env.DB_PORT as string) || 5432,
    database: process.env.DB_NAME,
    type: 'postgres',
    entities: [],
    synchronize: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: 'HAD_12@#$',
    signOptions: {
      expiresIn: '30d',
    },
  },
});
