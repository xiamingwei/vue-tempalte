import Main from '@/layout'
import menus from './menu.js'
import { deepClone } from '@/common/util.js'

/**
 * 单个路由
 */
const singlePages = [{
    path: '/login',
    name: 'login',
    meta: {
        hideInMenu: true,
        title: '登录'
    },
    component: () => import('@/view/login/login.vue')
}, {
    path: '/update-password',
    name: 'update-password',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/view/login/UpdatePassword')
}]

/**
 * 通过配置菜单项动态生成路由
 */
let childrenRoutes = []
function generateRoutes(menus) {
    menus.map(data => {
        if (data.children) {
            if(data.path) {
                let routeData = deepClone(data)
                delete routeData.children
                childrenRoutes.push(routeData)
            }
            generateRoutes(data.children)
        } else {
            childrenRoutes.push(data)
        }
    })
}

generateRoutes(menus)

/**
 * 嵌套路由
 */
const nestedPages = [{
    path: '/',
    redirect: '/home',
    component: Main,
    meta: {
        title: '首页',
    },
    children: childrenRoutes
}]

export const constantRouterMap = [...singlePages]

export const asyncRouterMap = [
    ...nestedPages,
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true,
        },
        component: () => import('@/view/error-page/404.vue')
    }
]