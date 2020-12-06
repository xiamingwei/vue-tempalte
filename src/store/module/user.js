import router from '@/router'
import Cookies from 'js-cookie';
import { asyncRouterMap, constantRouterMap } from '@/router/routers'
import { setMenus, setBreadcrumb, deepClone } from "@/common/util"
import menus from '@/router/menu.js'
import service from '@/service'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param pageList
 */
function filterAsyncRouter(asyncRouterMap, codes) {
    let accessedRoutes = []

    asyncRouterMap.forEach(asyncRoute => {
        if (asyncRoute.children) {
            let temp = deepClone(asyncRoute)
            temp.children = []

            asyncRoute.children.forEach(child => {
                if (codes.includes(child.meta.code)) {
                    temp.children.push(child)
                }
            })
            accessedRoutes.push(temp)
        } else {
            accessedRoutes.push(asyncRoute)
        }
    })

    return accessedRoutes
}

export default {
    namespaced : true,
    state : {
        isLogin: Cookies.get("loginState") || false,
        user: null,
        routers: constantRouterMap,
        menus: [],
        breadcrumb: {},
        codes: [], //后台传递的菜单权限码
        roles: [], //该账号角色, 可能有多个
    },
    getters : {
        isLogin: state => state.isLogin,
        user: state => state.user,
        routers: state => state.routers,
        menus: state => state.menus,
        breadcrumb: state => state.breadcrumb,
        roles: state => state.roles
    },
    mutations : {
        setLogin(state, data) {
            state.isLogin = data;
            Cookies.set("loginState", data);
        },
        setUser(state, data) {
            state.user = data;
        },
        setCode(state, data) {
            let codes = ['Home']
            data.forEach(menu => {
                if (menu.subNodeList && menu.subNodeList.length) {
                    menu.subNodeList.forEach(child => {
                        codes.push(child.code)
                    })
                } else {
                    codes.push(menu.code)
                }
            })

            state.codes = codes
        },
        setRole(state, data) {
            let roles = []

            data.forEach(item => {
                if (item.checked) {
                    roles.push(item.code)
                }
            })

            state.roles = roles
        },
        setRouters(state, data) {
            let accessedRouters = [];
            accessedRouters = filterAsyncRouter(asyncRouterMap, state.codes);
            router.addRoutes(accessedRouters);
            state.routers = constantRouterMap.concat(accessedRouters);
            state.menus = setMenus(menus, state.codes);
            state.breadcrumb = setBreadcrumb(state.menus);
        }
    },

    actions : {
        // 登录
        handleLogin({state, commit}, loginData) {
            return new Promise((resolve, reject) => {
                service
                    .login(loginData)
                    .then(result => {
                        commit('setLogin', true)
                        resolve(result);
                    })
                    .catch(res => {
                        reject(res);
                    })
            })
        },
        // 退出登录
        handleLogOut({state, commit}) {
            return new Promise((resolve, reject) => {
                service
                    .logout()
                    .then(result => {
                        commit("setLogin", false);
                        resolve(result);
                    })
                    .catch(res => {
                        reject(res);
                    })
            })
        },
        // 获取用户相关信息
        getUserInfo({state, commit}) {
            return new Promise((resolve, reject) => {
                service
                    .getUserInfo()
                    .then(result => {
                        commit('setUser', result.content.sysUser);
                        commit("setLogin", true);
                        commit("setCode", result.content.menuNodes)
                        commit("setRole", result.content.roles)
                        commit('setRouters')
                        resolve(result);
                    })
                    .catch(res => {
                        reject(res);
                    })
            })
        }
    }
}
