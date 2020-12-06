<template>
    <div class="update-password">
        <div class="update-form">
            <h3 class="update-title">修改密码</h3>
            <Form ref="pswFrom" :model="pswFrom" :rules="rulePswFrom" :label-width="110">
                <input class="perch-input"/>
                <input type="password" class="perch-input"/>
                <FormItem label="工号：" prop="username">
                    <Input v-model="pswFrom.username" :maxlength="50"></Input>
                </FormItem>
                <FormItem label="原始密码：" prop="oldPwd">
                    <Input type="password" v-model="pswFrom.oldPwd" :maxlength="50"></Input>
                </FormItem>
                <FormItem label="新密码：" prop="newPsw">
                    <Input type="password" v-model="pswFrom.newPsw" :maxlength="50"></Input>
                </FormItem>
                <FormItem label="确认新密码：" prop="confirmPsw">
                    <Input type="password" v-model="pswFrom.confirmPsw" :maxlength="50"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submitForgetPwd" long>重置密码</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import { validatePassword } from '@/common/iviewFormValidate'
    import { mapGetters, mapActions } from 'vuex'
    import md5 from 'js-md5'
    import store from '@/store'
    export default {
        name: "update-password",
        computed: {
            ...mapGetters('user', [
                'user'
            ])
        },
        data() {
            const validateSamePassword = (rule, value, callback) => {
                if (this.pswFrom.newPsw && value) {
                    if (this.pswFrom.newPsw !== value) {
                        callback(new Error('两次输入密码不一致'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }
            return {
                pswFrom: {
                    username: "",
                    oldPwd: "",
                    newPsw: "",
                    confirmPsw: ""
                },
                forgetCaptch: "",
                rulePswFrom: {
                    username: [{
                        required: true,
                        message: '请输入工号',
                        trigger: 'blur'
                    }],
                    oldPwd: [{
                        required: true,
                        message: '请输入原始密码',
                        trigger: 'blur'
                    },{
                        min: 5,
                        message: '长度不得少于5位',
                        trigger: 'blur'
                    },{
                        max: 20,
                        message: '长度不得多于20位',
                        trigger: 'blur'
                    },{
                        validator: validatePassword,
                        trigger: 'blur'
                    }],
                    newPsw: [{
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur'
                    },{
                        min: 8,
                        message: '长度不得少于8位',
                        trigger: 'blur'
                    },{
                        max: 20,
                        message: '长度不得多于20位',
                        trigger: 'blur'
                    },{
                        validator: validatePassword,
                        trigger: 'blur'
                    }],
                    confirmPsw: [{
                        required: true,
                        message: '请再次输入新密码',
                        trigger: 'blur'
                    },{
                        min: 8,
                        message: '长度不得少于8位',
                        trigger: 'blur'
                    },{
                        max: 20,
                        message: '长度不得多于20位',
                        trigger: 'blur'
                    },{
                        validator: validatePassword,
                        trigger: 'blur'
                    }, {
                        validator: validateSamePassword,
                        trigger: 'blur'
                    }]
                },
            };
        },
        methods: {
            ...mapActions("user", [
                'handleLogOut'
            ]),
            logout () {
                this.$Notice.success({
                    desc: "退出登录"
                });
                this.handleLogOut().then(() => {
                    this.$router.push({
                        name: 'login'
                    })
                })
            },
            submitForgetPwd() {
                this.$refs["pswFrom"].validate(valid => {
                    if (valid) {  
                        let param = {
                            oldPwd: md5(this.pswFrom.oldPwd),
                            newPwd: md5(this.pswFrom.confirmPsw),
                            username: this.pswFrom.username
                        }
               
                        this.service.updatePassword(param).then(result => {
                            this.$Notice.success({
                                desc: "修改成功, 请重新使用新密码登录!"
                            });
                            this.logout()
                        })
                    }
                })
            },
        }
    };
</script>

<style lang="less" scoped>
@import url('~@/styles/mixin.less');

.update-password {
    .flex-v();
    .flex-center();
    width: 100%;
    height: 100%;

    .perch-input {
        width: 0;
        height: 0;
        opacity: 0;
    }

    .update-form {
        .flex-v();
        .flex-center();
        background: @white;
        height: 400px;
        width: 500px;
        border-radius: 10px;

        .update-title {
            margin-bottom: 30px;
        }
    }
}
</style>
