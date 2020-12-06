
/**
 * meta: {
 *  title: { String }路由标题
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  isKeepAlive: 需要缓存的组件
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  activeName:(-) 设置页面在左侧菜单栏中所属的选中标志 (值必须是已存在的路由名) by endLess add
 * }
 */

const menus = [{
    path: '/home',
    icon: 'home',
    name: 'home',
    meta: {
        activeName: 'home',
        title: '首页',
        code: 'Home'
    },
    component: () => import('@/view/home')
},  {
    meta: {
        title: '系统管理'
    },
    icon: 'system',
    children: [{
        path: '/user-manage',
        name: 'user-manage',
        meta: {
            activeName: 'user-manage',
            title: '用户管理',
            code: 'User'
        },
        component: () => import('@/view/system/UserManage')
    },{
        path: '/menu-manage',
        name: 'menu-manage',
        meta: {
            activeName: 'menu-manage',
            title: '菜单管理',
            code: 'Menu'
        },
        component: () => import('@/view/system/MenuManage')
    },{
        path: '/role-manage',
        name: 'role-manage',
        meta: {
            activeName: 'role-manage',
            title: '角色管理',
            code: 'Role'
        },
        component: () => import('@/view/system/RoleManage')
    }]
},
]

export default menus