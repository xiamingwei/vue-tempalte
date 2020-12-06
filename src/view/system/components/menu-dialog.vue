<template>
    <Modal v-model="isVisible" :title="title" :mask-closable="false" @on-cancel="cancel">
        <Form ref="form" :model="form" :rules="rulesForm" :disabled="isOnlySee" :label-width="100">
            <FormItem prop="name" label="菜单名称：">
                <Input v-model="form.name" placeholder="请输入菜单名称" :maxlength="50" class="dialog-handle-width"></Input>
            </FormItem>
            <FormItem prop="code" label="编码：">
                <Input v-model="form.code" placeholder="请输入编码" :maxlength="50" :disabled="isCodeCanNotEdit" class="dialog-handle-width"></Input>
            </FormItem>
        </Form>
        <section slot="footer">
            <Button @click="cancel">取消</Button>
            <Button v-if="!isOnlySee" type="primary" :loading="isLoading" @click="confirm">确定</Button>
        </section>
    </Modal>
</template>

<script>
    const initForm = {
        name: '',
        code: ''
    }
    export default {
        name: 'menu-dialog',
        props: {
            value: {
                type: Boolean,
                default: false
            },
            operate: {
                type: String,
                default: ''
            },
            node: {
                type: Object,
                default: () => {}
            },
            getMenuTree: {
                type: Function,
                default: () => {}
            }
        },
        computed: {
            title() {
                let titleObj = {
                    ADD: '新增菜单',
                    MENU: '新增菜单',
                    UPDATE: '修改菜单',
                    SEE: '查看菜单'
                }

                return titleObj[this.operate]
            },
            isOnlySee() {
                if (this.operate === 'SEE') {
                    return true
                } else {
                    return false
                }
            },
            isAdd() {
                let addOperations = ['ADD', 'MENU']
                
                if (addOperations.includes(this.operate)) {
                    return true
                } else {
                    return false
                }
            },
            isCodeCanNotEdit() {
                if (this.isAdd) {
                    return false
                } else {
                    return true
                }
            }
        },
        data() {
            return {
                isVisible: this.value,
                form: { ...initForm },
                isLoading: false,
                rulesForm: {
                    name: [{
                        required: true,
                        message: '请输入菜单名称'
                    }],
                    code: [{
                        required: true,
                        message: '请输入编码名称'
                    }]
                },
                addOperations: ['ADD', 'MENU']
            }
        },
        methods: {
            cancel() {
                this.isVisible = false
                this.form = { ...initForm }
                this.$refs['form'].resetFields()
            },
            confirm() {
                this.$refs['form'].validate(value => {
                    if (!value) {
                        this.$Message.error({
                            background: true,
                            content: '请检查输入信息!'
                        })
                        return
                    }

                    if (this.isAdd) {
                        let data = {
                            name: this.form.name,
                            code: this.form.code,
                            pid: this.operate === 'ADD' ? this.node.id : 1 //增加一级菜单传1, 否则传当前id作为下级菜单的pid
                        }
                        this.addMenu(data)
                    } else {
                        let data = {
                            id: this.node.id,
                            name: this.form.name
                        }
                        this.updateMenu(data)
                    }
                })
            },
            addMenu(data) {
                this.isLoading = true
                this.service.addMenu(data).then(result => {
                    this.$Message.success({
                        background: true,
                        content: result.responseMsg
                    })
                    this.cancel()
                    this.getMenuTree()
                }).finally(() => {
                    this.isLoading = false
                })
            },
            updateMenu(data) {
                this.isLoading = true
                this.service.updateMenu(data).then(result => {
                    this.$Message.success({
                        background: true,
                        content: result.responseMsg
                    })
                    this.cancel()
                    this.getMenuTree()
                }).finally(() => {
                    this.isLoading = false
                })
            },
        },
        watch: {
            value(val) {
                this.isVisible = val

                if (val && !this.isAdd) {
                    this.form.name = this.node.name
                    this.form.code = this.node.code
                }
            },
            isVisible(val) {
                this.$emit('input', val)
            }
        }
    }
</script>