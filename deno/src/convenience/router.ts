import {
    Middleware,
    MiddlewareObj,
    MiddlewareFn,
    Composer,
} from '../composer.ts'
import { Context } from '../context.ts'

/**
 * A router lets you specify a number of middlewares, each of them identified by
 * a string key. You can then pass a routing function that decides based on the
 * context which middleware to choose by returning one of the keys.
 *
 * ```ts
 * const router = new Router(ctx => {
 *   // determine route to pick here
 *   return 'key'
 * })
 *
 * router.on('key',       ctx => { ... })
 * router.on('other-key', ctx => { ... })
 * router.otherwise(ctx => { ... }) // called if no route matches
 *
 * bot.use(router)
 * ```
 */
export class Router<C extends Context> implements MiddlewareObj<C> {
    private otherwiseHandler: Composer<C> | undefined

    /**
     * Constructs a router with a routing function and optionally some
     * preinstalled middlewares. Note that you can always install more
     * middleware on the router by calling `on`.
     *
     * @param router A routing function that decides which middleware to run
     * @param routeHandlers A number of middlewares
     */
    constructor(
        private readonly router: (ctx: C) => string | undefined,
        public routeHandlers = new Map<string, Middleware<C>>()
    ) {}

    /**
     * Registers new middleware for a given route. The intially supplied routing
     * function may return this route as a string to select the respective
     * middleware for execution for an incoming update.
     *
     * @param route The route for which to register the middleware
     * @param middleware The middleware to register
     */
    on(route: string, ...middleware: Array<Middleware<C>>) {
        this.routeHandlers.set(route, new Composer(...middleware))
        return this
    }

    /**
     * Allows to register middleware that is executed when no route matches, or
     * when the routing function returns `undefined`. If this method is not
     * called, then the router will simply pass through all requests to the
     * downstream middleware.
     *
     * @param middleware Middleware to run if no route matches
     */
    otherwise(...middleware: Array<Middleware<C>>) {
        this.otherwiseHandler = new Composer(...middleware)
        return this
    }

    middleware(): MiddlewareFn<C> {
        return new Composer<C>()
            .lazy(ctx => {
                const route = this.router(ctx)
                return (
                    (route === undefined
                        ? this.otherwiseHandler
                        : this.routeHandlers.get(route)) ?? []
                )
            })
            .middleware()
    }
}
