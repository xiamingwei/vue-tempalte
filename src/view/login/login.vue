<template>
    <div class="login-container">
        <header class="login-header">
            <p>{{title}}</p>
        </header>
        <div id="login">
            <div class="login">
                <h3>{{title}}</h3>
                <div class="login-title">
                    <span>登录</span>
                </div>
                <Form ref="userForm" :model="userForm" :rules="userRule" class="form">
                    <FormItem prop="account">
                        <Input type="text" v-model="userForm.account" placeholder="用户名" :maxlength="20">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="userForm.password" placeholder="密码" :maxlength="20" @on-enter="handleSubmit">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('userForm')" long>
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import md5 from 'js-md5'
    import { title } from '@/common/config'
    export default {
        name: "login",
        data() {
            return {
                userForm: {
                    account: "",
                    password: "",
                },
                userRule: {
                    account: [{
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }],
                    password: [{
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }],
                },
                title: title
            };
        },
        methods: {
            ...mapActions("user", [
                'handleLogin',
                'getUserInfo'
            ]),
            handleSubmit(name) {
                this.$refs['userForm'].validate(value => {
                    if (value) {
                        let data = {
                            account: this.userForm.account,
                            password: md5(this.userForm.password)
                        }
                        this.handleLogin(data).then(result => {
                            this.getUserInfo().then(res => {
                                this.$router.push('/home');
                            }).catch(error => {
                            })
                        })
                        .catch(error => {
                        })
                    }
                })
            }
        }
    };
</script>

<style lang="less" scoped>
.login-container {
    .flex-v();
    height: 100%;

    .login-header {
        width: 100%;
        height: 50px;
        background: #051a2e;
        color: @white;
        font-size: 16px;
        line-height: 50px;
        padding-left: 20px;
    }

    #login {
        .flex-grow();
        .flex();
        .flex-center();
        background: url('~@/assets/background.jpg') no-repeat;
        background-size: cover;

        .login {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 320px;
            width: 350px;
            background: @white;
            border-radius: 10px;
            margin-bottom: 150px;
            
            .login-title {
                width: 300px;
                text-align: left;
                color: #2cb3ff;
            }
            .forget-password {
                text-align: center;
            }
        }
    }

    .captcha {
        background: @white;
        height: 32px;
        width: 120px;
        cursor: pointer;
    }

    .form {
        width: 300px;
        margin-top: 15px;
    }
}
</style>