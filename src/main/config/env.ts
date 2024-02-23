export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/superpoll-api',
  port: process.env.PORT || 3000,
}
