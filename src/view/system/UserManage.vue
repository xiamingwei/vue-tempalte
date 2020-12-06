<template>
    <div class="container">
        <search-bar v-model="queryObj" @getList="getList">
            <div slot="query-row" class="flex">
                <div class="search-tools-handle">
                    <label>用户名称：</label>
                    <Input v-model="queryObj.username"></Input>
                </div>
                <div class="search-tools-handle">
                    <label>门店名称：</label>
                    <Select v-model="queryObj.orgId" class="width">
                        <Option v-for="store in storeList" :key="store.id" :value="store.id">{{store.name}}</Option>
                    </Select>
                </div>
                <div class="search-tools-handle">
                    <label>姓名：</label>
                    <Input v-model="queryObj.realName"></Input>
                </div>
                <div class="search-tools-handle">
                    <label>电话：</label>
                    <Input v-model="queryObj.account"></Input>
                </div>
            </div>
        </search-bar>
        <common-table :columns="columns" :datas="datas" :tableInfo="tableInfo" @changePage="getList"></common-table>
        <user-dialog v-model="dialog.showUserDialog" :operate="dialog.operate" :currentRowId="dialog.currentRowId"></user-dialog>
    </div>
</template>

<script>
const initQueryObj = {
    username: '',
    orgId: '',
    account: '',
    realName: ''
}

import list from '@/common/page-mixin'
import userDialog from './components/user-dialog'
import { throttle, formatDate } from '@/common/util'
export default {
    name: 'user-manage',
    mixins: [list],
    components: {
        userDialog
    },
    mounted() {
        this.getList()
        this.getStoreDropList()
    },
    data() {
        return {
            queryObj: { ...initQueryObj },
            storeList: [],
            columns: [{
                title: 'ID',
                key: 'id',
                width: 80
            }, {
                title: '用户名称',
                key: 'username',
                width: 150
            }, {
                title: '姓名',
                key: 'realName',
                width: 150
            }, {
                title: '邮箱',
                key: 'email',
                width: 200
            }, {
                title: '电话',
                key: 'phone',
                width: 150
            }, {
                title: '门店',
                key: 'orgName',
                minWidth: 150
            }, {
                title: '创建人',
                key: 'creator',
                width: 150
            }, {
                title: '创建时间',
                width: 180,
                key: 'createTime',
                render: (h, params) => {
                    return h('span', formatDate(params.row.createTime))
                }
            }, {
                title: '操作',
                fixed: 'right',
                width: 140,
                render: (h, params) => {
                    return h('div', {

                    }, [
                        h('Button', {
                            props: {
                                type: 'primary',
                            },
                            on: {
                                click: () => {
                                    this.see('ROLE', params.row)
                                }
                            }
                        }, '角色'),
                        h('Button', {
                            on: {
                                click: () => {
                                    this.see('MENU', params.row)
                                }
                            }
                        }, '菜单')
                    ])
                }
            }],
            datas: [],
            dialog: {
                showUserDialog: false,
                operate: '',
                currentRowId: null
            },
        }
    },
    methods: {
        getList(page = 1) {
            this.tableInfo.current = page
            let data = {
                realName: this.queryObj.realName,
                account: this.queryObj.account,
                username: this.queryObj.username,
                orgId: this.queryObj.orgId,
                pageNum: this.tableInfo.current,
                pageSize: this.tableInfo.pageSize
            }
            this.tableInfo.loading = true
            this.service.getUserList(data).then(result => {
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
        see(type, row) {
            this.dialog.showUserDialog = true
            this.dialog.operate = type
            this.dialog.currentRowId = row.id
        },
        getStoreDropList() {
            this.service.getStoreDropList().then(result => {
                this.storeList = result.content
            })
        }
    }
}
</script>