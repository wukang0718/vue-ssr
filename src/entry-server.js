import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject(new Error({url: fullPath}))
    }
    router.push(url)

    const meta = app.$meta()
    context.meta = meta
    router.onReady(() => {
      const matchedComponets = router.getMatchedComponents()
      if (!matchedComponets.length) {
        return reject(new Error({code: 404}))
      }

      Promise.all(matchedComponets.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        context.state = store.state
        resolve(app)
      }).catch(reject)
    })
  })
}
