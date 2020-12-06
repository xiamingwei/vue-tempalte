<template>
    <Modal v-model="isVisible" :title="title" :mask-closable="false" @on-cancel="cancel">
        <Form ref="form" :model="form" :rules="rulesForm" :disabled="isOnlySee" :label-width="100">
            <FormItem prop="name" label="用户姓名：">
                <Input v-model="form.name" placeholder="请输入用户名称" :maxlength="20" class="dialog-handle-width"></Input>
            </FormItem>
            <FormItem prop="code" label="角色码：">
                <Input v-model="form.code" placeholder="请输入角色码" :maxlength="20" class="dialog-handle-width"></Input>
            </FormItem>
        </Form>
        <section slot="footer">
            <Button @click="cancel">取消</Button>
            <Button v-if="!isOnlySee" type="primary" @click="confirm" :loadding="isLoading">确定</Button>
        </section>
    </Modal>
</template>

<script>
    const initForm = {
        name: '',
        code: ''
    }
    export default {
        name: 'role-dialog',
        props: {
            value: {
                type: Boolean,
                default: false
            },
            operate: {
                type: String,
                default: ''
            },
            currentRow: {
                type: Object,
                default: () => {}
            },
            getList: {
                type: Function,
                default: () => {}
            }
        },
        computed: {
            title() {
                let titleObj = {
                    ADD: '新增角色',
                    UPDATE: '修改角色',
                    SEE: '查看角色'
                }

                return titleObj[this.operate]
            },
            isOnlySee() {
                if (this.operate === 'SEE') {
                    return true
                } else {
                    return false
                }
            }
        },
        data() {
            return {
                isVisible: this.value,
                form: { ...initForm },
                rulesForm: {
                    name: [{
                        required: true,
                        message: '请输入用户姓名'
                    }],
                    code: [{
                        required: true,
                        message: '请输入角色码'
                    }]
                },
                isLoading: false
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

                    if (this.operate === 'ADD') {
                        this.addRole(this.form)
                    } else {
                        let data = {
                            id: this.currentRow.id,
                            name: this.form.name,
                            code: this.form.code
                        }
                        this.updateRole(data)
                    }
                    
                })
            },
            addRole(data) {
                this.isLoading = true
                this.service.addRole(data).then(result => {
                    this.$Message.success({
                        background: true,
                        content: result.responseMsg
                    })
                    this.cancel()
                    this.getList()
                }).finally(() => {
                    this.isLoading = false
                })
            },
            updateRole(data) {
                this.isLoading = true
                this.service.updateRole(data).then(result => {
                    this.$Message.success({
                        background: true,
                        content: result.responseMsg
                    })
                    this.cancel()
                    this.getList()
                }).finally(() => {
                    this.isLoading = false
                })
            },
        },
        watch: {
            value(val) {
                this.isVisible = val

                if (val && this.operate !== 'ADD') {
                    this.form.name = this.currentRow.name
                    this.form.code = this.currentRow.code
                }
            },
            isVisible(val) {
                this.$emit('input', val)
            }
        }
    }
</script>