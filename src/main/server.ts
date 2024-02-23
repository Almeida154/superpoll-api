import env from './config/env'

import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

MongoClient.connect({ url: env.mongoUrl })
  .then(async () => {
    console.log(`📦 Mongo running at ${env.mongoUrl}`)

    const app = await import('./config/app')

    app.default.listen(env.port, () => {
      console.log(`🔥 Server running at http://localhost:${env.port}`)
    })
  })
  .catch(console.error)
