import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  const routePaths = fg.sync(['**/src/main/routes/**/*.ts', '!**/*.test.ts'])

  routePaths.forEach(async (routePath) => {
    const routeName = routePath.split('/').at(-1)
    const route = await import(`@/main/routes/${routeName}`)
    route.default(router)
  })
}
