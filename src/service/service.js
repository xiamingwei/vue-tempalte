import httpMethod from './method';
import qs from 'qs';
import { formDataHeader } from '@/common/config'

let { getService, postService, putService, deleteService } = httpMethod;

let objToString = function(obj) {
    var str = '';

    Object.keys(obj).forEach((key,index) => {
        if(index == 0){
            str = str + `?${key}=${obj[key]}`;
        }
        else {
            str = str + `&${key}=${obj[key]}`;
        }
    })
   
    return str;
};

/**
 * 对于FormData格式 请用qs.stringify(data)转化一次
 */

let request = {
    /**
     * 用户登录
     */
    login: (data) => postService(`/sysLogin/login`, data),
    /**
     * 退出登录
     */
    logout: () => getService(`/sysLogin/loginOut`),
    /**
     * 修改密码
     */
    updatePassword: (data) => putService(`/sysLogin/modifyPassword`, data),
    /**
     * 获取用户信息
     */
    getUserInfo: () => getService(`/sysLogin/getHeader`),
    /**
     * 系统管理 start
     */

    /**
     * 获取菜单信息
     */
    getMenuTree: () => getService(`/sysMenu`),
    /**
     * 新增菜单
     */
    addMenu: (data) => postService(`/sysMenu/add`, data),
    /**
     * 修改菜单
     */
    updateMenu: (data) => putService(`/sysMenu/update`, data),
    /**
     * 删除菜单
     */
    deleteMenu: (menuId) => deleteService(`/sysMenu/delete/${menuId}`),
    /**
     * 获取角色列表
     */
    getRoleList: (data) => postService(`/sysRole/roles`, data),
    /**
     * 新增角色
     */
    addRole: (data) => postService(`/sysRole/add`, data),
    /**
     * 修改角色
     */
    updateRole: (data) => putService(`/sysRole/update`, data),
    /**
     * 删除角色
     */
    deleteRole: (id) => deleteService(`/sysRole/delete/${id}`),
    /**
     * 查询某角色菜单权限
     */
    getRoleMenu: (roleId) => getService(`/sysRole/menus/${roleId}`),
    /**
     * 更新某角色菜单权限
     */
    updateRoleMenu: (data) => postService(`/sysRole/addMenus`, data),
    /**
     * 获取用户列表
     */
    getUserList: (data) => postService(`/sysUser/users`, data),
    /**
     * 查询用户关联角色
     */
    getUserRole: (userId) => getService(`/sysUser/roles/${userId}`),
    /**
     * 更新用户关联角色
     */
    updateUserRole: (data) => postService(`/sysUser/addRoles`, data),
    /**
     * 查询用户关联菜单
     */
    getUserMenus: (userId) => getService(`/sysUser/menus/${userId}`),

    /**
     * 系统管理 end
     */
} 

export default request