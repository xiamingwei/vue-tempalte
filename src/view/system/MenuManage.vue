<template>
    <div class="container">
        <v-menu-tree :nodes="datas" :options="options" @select-menu="selectMenu"></v-menu-tree>
        <Button type="primary" @click="addMenu" class="add-menu-btn">增加一级菜单</Button>
        <menu-dialog v-model="dialog.showMenuDialog" :operate="dialog.operate" :node="dialog.node" :getMenuTree="getMenuTree"></menu-dialog>
    </div>
</template>

<script>
    import vMenuTree from './components/v-menu-tree'
    import menuDialog from './components/menu-dialog'
    import { deepClone, throttle } from '@/common/util'
    export default {
        name: 'menu-manage',
        components: {
            vMenuTree,
            menuDialog
        },
        mounted() {
            this.deleteMenu = throttle(this.deleteMenu, 1500)
            this.getMenuTree()
        },
        data() {
            return {
                options: {
                    label: 'name',
                    recursion: 'subNodeList',
                    expandLabel: 'expand',
                    menuList: [{
                        label: '新增',
                        value: 'ADD'
                    }, {
                        label: '修改',
                        value: 'UPDATE'
                    }, {
                        label: '详情',
                        value: 'SEE'
                    }, {
                        label: '删除',
                        value: 'DELETE'
                    }]
                },
                datas: [],
                dialog: {
                    operate: '',
                    showMenuDialog: false,
                    node: {}
                }
            }
        },
        methods: {
            getMenuTree() {
                this.service.getMenuTree().then(result => {
                    this.datas = deepClone(result.content)
                })
            },
            deleteMenu(id) {
                this.service.deleteMenu(id).then(result => {
                    this.$Message.success({
                        background: true,
                        content: result.responseMsg
                    })
                    this.getMenuTree()
                })
            },
            selectMenu(menu, node) {
                if (menu.value === 'DELETE') {
                    this.$Modal.confirm({
                        title: '确定删除吗?',
                        onOk: () => {
                            this.deleteMenu(node.id)
                        }
                    })
                } else {
                    this.dialog.operate = menu.value
                    this.dialog.showMenuDialog = true
                    this.dialog.node = node
                }
            },
            addMenu() {
                this.dialog.operate = 'MENU'
                this.dialog.showMenuDialog = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .add-menu-btn {
        margin-top: 50px;
    }
</style>