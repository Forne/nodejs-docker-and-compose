export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: parseInt(process.env.JWT_EXPIRATION, 10) || 604800,
  },
});
