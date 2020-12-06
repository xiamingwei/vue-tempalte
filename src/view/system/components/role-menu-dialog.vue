<template>
    <Modal v-model="isVisible" title="角色菜单" :mask-closable="false" @on-cancel="cancel">
        <Tree :data="datas" show-checkbox></Tree>
        <section slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="confirm" :loading="isLoading">确定</Button>
        </section>
    </Modal>
</template>

<script>
    import { deepClone, tranverseTree } from '@/common/util'
    export default {
        name: 'role-menu-dialog',
        props: {
            value: {
                type: Boolean,
                default: false
            },
            currentRowId: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                isVisible: this.value,
                datas: [],
                isLoading: false
            }
        },
        methods: {
            cancel() {
                this.isVisible = false
                this.datas = []
            },
            confirm() {
                let data = {
                    roleId: this.currentRowId,
                    menuIds: this.collectCheckedNode(this.datas)
                }
                this.updateRoleMenu(data)
            },
            // 父级半选中状态Tree组件checked不会为true, 但后台要要, 所以得自己判断
            collectCheckedNode(datas) {
                let ids = []
                
                datas.forEach(data => {
                    data.children.forEach(child => {
                        if (child.checked) {
                            !ids.includes(data.id) && ids.push(data.id)
                            ids.push(child.id)
                        }
                    })
                })

                return ids
            },
            getRoleMenu(id) {
                this.service.getRoleMenu(id).then(result => {
                    result.content.forEach(data => {
                        let selectedNodeCount = 0

                        data.subNodeList.forEach(node => {
                            node.checked && selectedNodeCount++
                        })
                        // 因为树组件在父节点被勾的情况下, 是默认选中所有子节点, 所以需要判断子节点选中个数
                        selectedNodeCount && (data.checked = selectedNodeCount === data.subNodeList.length ? true : false)
                    })
                    this.datas = deepClone(result.content)
                    this.datas = tranverseTree(this.datas)
                })
            },
            updateRoleMenu(data) {
                this.isLoading = true
                this.service.updateRoleMenu(data).then(result => {
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
                    this.getRoleMenu(this.currentRowId)
                }
            },
            isVisible(val) {
                this.$emit('input', val)
            }
        }
    }
</script>