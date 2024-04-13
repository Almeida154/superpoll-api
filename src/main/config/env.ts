export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/superpoll-api',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT || '%default_secret%',
}
