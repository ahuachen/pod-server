import Router, { IRouterParamContext } from 'koa-router'
import { PodServerManditoryOptionsConfiguration } from '../types/configuration.types';
import Koa, { Context, ParameterizedContext } from 'koa';

// TODO: this whole file will be changed once routing configuration is enabled. But for now, we hard code the subdomain routing strategy

function getSubdomainRouter(config: PodServerManditoryOptionsConfiguration): Router {
  const router = new Router()
  router.get('/', (ctx) => {
    console.log('Subdomain')
    ctx.res.end()
  })
  return router
}

function getRootRouter(config: PodServerManditoryOptionsConfiguration): Router {
  const router = new Router()
  router.get('/', (ctx) => {
    console.log('root')
    ctx.res.end()
  })
  return router
}

export default function initailizeRoutes(app: Koa, config: PodServerManditoryOptionsConfiguration): void {
  const passIfSubdomain = async (shouldPass: boolean, ctx: ParameterizedContext, next: () => Promise<any>, givenRouter: Router): Promise<any> => {
    console.log('getting called')
    console.log(shouldPass, ctx.origin, config.network.url.origin, (ctx.origin !== config.network.url.origin) === (shouldPass))
    if ((ctx.origin !== config.network.url.origin) === (shouldPass)) {
      await givenRouter.routes()(ctx as ParameterizedContext<any, IRouterParamContext<any, {}>>, async () => {
        await givenRouter.allowedMethods()(ctx as ParameterizedContext<any, IRouterParamContext<any, {}>>, next)
      })
    } else {
      await next()
    }
  }

  const subdomainRouter = getSubdomainRouter(config)
  const rootRouter = getRootRouter(config)

  app.use(async (ctx, next) => {
    console.log('beep boop')
    await next()
  })
  app.use(async (ctx, next) => await passIfSubdomain(true, ctx, next, subdomainRouter))
  app.use(async (ctx, next) => await passIfSubdomain(false, ctx, next, rootRouter))
}

