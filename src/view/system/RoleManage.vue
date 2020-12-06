<template>
    <div class="container">
        <search-bar v-model="queryObj" @getList="getList">
            <div slot="query-row">
                <div class="search-tools-handle">
                    <label>角色名称：</label>
                    <Input v-model="queryObj.name"></Input>
                </div>
            </div>
            <Button slot="custom-btn" @click="add" class="custom-btn">
                <Icon type="md-add"></Icon>
                <span>新增</span>
            </Button>
        </search-bar>
        <common-table :columns="columns" :datas="datas" :tableInfo="tableInfo" @changePage="getList"></common-table>
        <role-dialog v-model="dialog.showRoleDialog" :operate="dialog.operate" :currentRow="dialog.currentRow" :getList="getList"></role-dialog>
        <role-menu-dialog v-model="showRoleMenuDialog" :currentRowId="dialog.currentRow.id" ></role-menu-dialog>
    </div>
</template>

<script>
const initQueryObj = {
    name: ''
}
import list from '@/common/page-mixin'
import roleDialog from './components/role-dialog'
import roleMenuDialog from './components/role-menu-dialog'
import { throttle } from '@/common/util'
export default {
    name: 'role-manage',
    mixins: [list],
    components: {
        roleDialog,
        roleMenuDialog
    },
    mounted() {
        this.delete = throttle(this.delete, 1500)
        this.getList()
    },
    data() {
        return {
            queryObj: { ...initQueryObj },
            columns: [{
                title: 'ID',
                key: 'id'
            }, {
                title: '用户名称',
                key: 'name'
            }, {
                title: '角色码',
                key: 'code'
            }, {
                title: '操作',
                width: 350,
                render: (h, params) => {
                    return h('div', {

                    }, [
                        h('Button', {
                            props: {
                                type: 'primary'
                            },
                            on: {
                                click: () => {
                                    this.update(params.row)
                                }
                            }
                        }, '修改'),
                        h('Button', {
                            on: {
                                click: () => {
                                    this.see('DETAIL', params.row)
                                }
                            }
                        }, '详情'),
                        h('Button', {
                            on: {
                                click: () => {
                                    this.see('MENU', params.row)
                                }
                            }
                        }, '角色菜单'),
                        h('Poptip', {
                            props: {
                                title: '确定删除吗?',
                                transfer: true,
                                confirm: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.delete(params.row)
                                }
                            }
                        }, [
                            h('Button', {
                                class: 'tb-op-btn',
                                props: {
                                    type: 'error'
                                }
                            }, '删除')
                        ])
                    ])
                }
            }],
            datas: [],
            dialog: {
                showRoleDialog: false,
                operate: '',
                currentRow: {}
            },
            showRoleMenuDialog: false
        }
    },
    methods: {
        getList(page = 1) {
            this.tableInfo.current = page
            let data = {
                name: this.queryObj.name,
                pageNum: this.tableInfo.current,
                pageSize: this.tableInfo.pageSize
            }
            this.tableInfo.loading = true
            this.service.getRoleList(data).then(result => {
                this.datas = result.content.dataList
                this.tableInfo.total = result.content.total
            }).finally(() => {
                this.tableInfo.loading = false
            })
        },
        reset() {
            this.queryObj = { ...initQueryObj }
            this.getList()
        },
        add() {
            this.dialog.showRoleDialog = true
            this.dialog.operate = 'ADD'
        },
        update(row) {
            this.dialog.showRoleDialog = true
            this.dialog.operate = 'UPDATE'
            this.dialog.currentRow = row
        },
        see(type, row) {
            this.dialog.currentRow = row
            if (type === 'DETAIL') {
                this.dialog.showRoleDialog = true
                this.dialog.operate = 'SEE'
            } else {
                this.showRoleMenuDialog = true
            }
        },
        delete(row) {
            this.service.deleteRole(row.id).then(result => {
                this.$Message.success({
                    background: true,
                    content: result.responseMsg
                })
                this.getList()
            })
        },
    }
}
</script>