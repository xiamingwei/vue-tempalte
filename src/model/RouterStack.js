export default function(to, from, store) {
    let routeChain = store.getters["routerStack/routerChain"];
    let routeLength = routeChain.length;
    
    if (routeLength === 0) {
        if (to.path === from.path && to.path === "/") {
            // 当直接打开根路由的时候
            store.commit("routerStack/pushRouterChain", to);
        } 
        else {
            // 直接打开非根路由的时候生成两个路径，from为根路由
            store.commit("routerStack/pushRouterChain", from);
            store.commit("routerStack/pushRouterChain", to);
        }
    } 
    else if (routeLength === 1) {
        store.commit("routerStack/pushRouterChain", to);
    } 
    else {
        // 判断 to 是否已经存在于 router-stack，如果已存在，则当作是返回
        let pathesInStack = routeChain.map(item => item.path);

        if (pathesInStack.indexOf(to.path) >= 0) {
            store.commit("routerStack/popRouterChain", to);
        } 
        else {
            //如果是平级路由关系，先让原路由出栈，目标路由再入栈 (利用路由元数据activeName来判断)
            if(to.meta.activeName != from.meta.activeName) {
                store.commit("routerStack/popRouterChain");
            }
            
            store.commit("routerStack/pushRouterChain", to);
        }
    }
}
