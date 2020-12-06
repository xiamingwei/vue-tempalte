import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import routerStack from "./module/router-stack";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        user,
        routerStack
    }
})
