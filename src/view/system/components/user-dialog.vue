<template>
    <Modal v-model="isVisible" :title="title" :mask-closable="false" @on-cancel="cancel" >
        <div v-if="isUserOperate">
            操作
        </div>
        <div v-else-if="operate === 'ROLE'">
            <Checkbox v-for="role in roleList" v-model="role.checked" :key="role.id">{{role.name}}</Checkbox>
        </div>
        <div v-else>
            <Tree :data="menuList" show-checkbox></Tree>
        </div>
        <section slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="confirm">确定</Button>
        </section>
    </Modal>
</template>

<script>
    const initForm = {

    }
    import { deepClone, tranverseTree } from '@/common/util'
    export default {
        name: 'user-dialog',
        props: {
            value: {
                type: Boolean,
                default: false
            },
            operate: {
                type: String,
                default: ''
            },
            currentRowId: {
                type: Number,
                default: null
            }
        },
        computed: {
            isUserOperate() {
                let operations = ['ADD', 'UPDATE', 'SEE']

                if (operations.includes(this.operate)) {
                    return true
                } else {
                    return false
                }
            },
            title() {
                let titleObj = {
                    ADD: '新增用户',
                    UPDATE: '修改用户',
                    SEE: '用户详情',
                    ROLE: '关联角色',
                    MENU: '关联菜单'
                }

                return titleObj[this.operate]
            }
        },
        data() {
            return {
                isVisible: this.value,
                roleList: [],
                menuList: [],
                form: { ...initForm }
            }
        },
        methods: {
            cancel() {
                this.isVisible = false
                this.roleList = []
                this.menuList = []
                this.form = { ...initForm }
            },
            confirm() {
                if (this.operate === 'ROLE') {
                    let roleIds = []

                    this.roleList.forEach(role => {
                        if (role.checked) {
                            roleIds.push(role.id)
                        }
                    })
                    let data = {
                        userId: this.currentRowId,
                        roleIds
                    }
                    this.updateUserRole(data)
                }
            },
            getUserRole(id) {
                this.service.getUserRole(id).then(result => {
                    this.roleList = result.content
                })
            },
            getUserMenus(id) {
                this.service.getUserMenus(id).then(result => {
                    result.content.forEach(data => {
                        let selectedNodeCount = 0
                        data.disabled = true

                        data.subNodeList.forEach(node => {
                            node.disabled = true
                            node.checked && selectedNodeCount++
                        })
                        // 因为树组件在父节点被勾的情况下, 是默认选中所有子节点, 所以需要判断子节点选中个数
                        selectedNodeCount && (data.checked = selectedNodeCount === data.subNodeList.length ? true : false)
                    })
                    this.menuList = deepClone(result.content)
                    this.menuList = tranverseTree(this.menuList)
                })
            },
            updateUserRole(data) {
                this.isLoading = true
                this.service.updateUserRole(data).then(result => {
                    this.$Message.success({
                        background: true,
                        content: result.responseMsg
                    })
                    this.cancel()
                }).finally(() => {
                    this.isLoading = false
                })
            }
        },
        watch: {
            value(val) {
                this.isVisible = val

                if (val) {
                    if (this.operate === 'ROLE') {
                        this.getUserRole(this.currentRowId)
                    }

                    if (this.operate === 'MENU') {
                        this.getUserMenus(this.currentRowId)
                    }
                }
            },
            isVisible(val) {
                this.$emit('input', val)
            }
        }
    }
</script>