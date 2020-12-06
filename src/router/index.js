import Vue from 'vue'
import Router from 'vue-router'
import { asyncRouterMap, constantRouterMap } from './routers'
import store from "../store";
import RouterStack from "../model/RouterStack";

import iView from 'iview'
Vue.use(Router)
const LOGIN_PAGE_NAME = 'login'
const HOME_PAGE_NAME = 'home'
const UPDATE_PASSWORD_NAME = 'update-password'

const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

/**
 * 解决点击同样菜单栏报错的问题
 */
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    RouterStack(to, from, store);
    let isLogin = store.getters["user/isLogin"];
    const NOT_AUTH = ['update-password'];

    if (NOT_AUTH.includes(to.name)) {
        next();
    } else {
        if (!isLogin && to.name !== LOGIN_PAGE_NAME) {
            // 未登录且要跳转的页面不是登录页
            next({
                name: LOGIN_PAGE_NAME // 跳转到登录页
            });
        } 
        else if (!isLogin && to.name === LOGIN_PAGE_NAME) {
            // 未登陆且要跳转的页面是登录页
            next(); // 跳转
        } else if (isLogin && to.name === LOGIN_PAGE_NAME) {
            // 已登录且要跳转的页面是登录页
            next({
                name: HOME_PAGE_NAME // 跳转到主页
            });
        } else {
            if (store.getters["user/user"]) {
                next();
            } else {
                store.dispatch('user/getUserInfo').then(user => {
                    next({ ...to, replace: true });
                })
                .catch(() => {
                    store.commit('user/setLogin', false);
                    next({
                        name: LOGIN_PAGE_NAME
                    });
                })
            }
        }
    }
});

router.afterEach(to => {
    window.document.title = to.meta.title || "";
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
})

export default router