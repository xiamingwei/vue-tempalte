export default {
    namespaced: true,
    state: {
        routerChain: [],
    },
    getters: {
        routerChain: state => state.routerChain,
        getCacheRouters: state => {
            let tempChain = state.routerChain.filter(item => {
                return !!item.meta.keepAlive;
            });

            // 找到每个路由匹配的组件名
            let results = tempChain.map(item => {
                return item.name;
            });

            return results;
        }
    },
    mutations: {
        pushRouterChain(state, route) {
            state.routerChain.push(route);
        },
        popRouterChain(state, route) {
            if (route) {
                // 若有 route 参数，表示 pop 到该 route
                let pathes = state.routerChain.map(item => item.path);
                let index = pathes.indexOf(route.path);
                // 先将 stack 中的原路由对象替换为新的路由对象
                // 可能新的路由对象有新的参数，将“原路由对象替换为新的路由对象”可一定程度上保证正确性。
                state.routerChain.splice(index, 1, route);
                index += 1;

                if (index > 0 && index < pathes.length) {
                    state.routerChain = state.routerChain.slice(0, index);
                }
            } 
            else {
                // 若没有 route 参数，就 pop 最上层那一个
                state.routerChain.pop();
            }
        },
    }
};
