import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

export function createApp () {
  const store = createStore()
  const router = createRouter()

  // 判断当前用户的userKey，如果不存在就返回登录页面
  router.beforeEach((to, from, next) => {
    if (to.path === '/' || to.path === '/login' || store.state.pageStatus) {
      // 到登录页面不需要判断用户的userKey或者页面刷新的时候不做判断
      // 如果页面刷新做判断会直接返回登录页面
      // 如果到登录页面清除用户的userKey
      store.commit('SET_UserKey', '')
      next()
    } else {
      // 判断store中保存的userKey，存在就进入路由，不存在就进入登录页面
      store.state.userKey ? next() : next('/login')
    }
  })

  sync(store, router)

  const app = new Vue({
    store,
    router,
    render: h => h(App)
  })

  return { app, router, store }
}
