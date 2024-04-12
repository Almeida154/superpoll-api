// import fg from 'fast-glob'
import { Express, Router } from 'express'
import authentication from '../routes/authentication'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  authentication(router)

  // const routePaths = fg.sync(['**/src/main/routes/**/*.ts', '!**/*.test.ts'])

  // await Promise.all(
  //   routePaths.map(async (routePath) => {
  //     const routeName = routePath.split('/').at(-1)
  //     const route = await import(`@/main/routes/${routeName}`)
  //     route.default(router)
  //   }),
  // )
}
