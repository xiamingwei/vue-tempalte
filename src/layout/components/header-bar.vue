<template>
    <header class="header-bar-container">
        <div class="header-bar flex-h flex-v-center">
            <div class="system-title">{{title}}</div>
            <div class="right-menu flex-grow flex-h flex-v-center flex-end">
                <div class="user-avator-dropdown flex-h flex-v-center">
                    <div class="account">{{store}}{{account}},您好</div>
                    <Dropdown @on-click="handleClick" class="my-dropdown">
                        <img src="~@/assets/images/avatar.png">
                        <DropdownMenu slot="list">
                            <DropdownItem name="modifyPassword">修改密码</DropdownItem>
                            <DropdownItem name="logout">退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div class="breadcurmbs">{{breadcrumbs}}</div>
    </header>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import { title } from '@/common/config'
    export default {
        data() {
            return {
                title: title,
            }
        },
        computed: {
            ...mapGetters('user', [
                'breadcrumb',
                'user'
            ]),
            account() {
                return this.user.username || 'admin'
            },
            breadcrumbs() {
                return this.breadcrumb[this.$route.path]
            },
            store() {
                return this.user.orgName;
            }
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
            modifyPassword() {
                this.$router.push('/update-password')
            },
            handleClick (name) {
                switch (name) {
                    case 'logout': 
                        this.logout();
                        break;
                    case 'modifyPassword': 
                        this.modifyPassword();
                        break;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.header-bar-container {
    .flex-v();

    .header-bar {
        height: 47px;
        background: #011b34;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        color: @white;
        .system-title {
            font-size: 16px;
            margin-left: 8px;
            margin-bottom: 3px;
            text-align: center;
        }
        .right-menu {
            height: 47px;
            margin-right: 40px;
            .user-avator-dropdown {
                cursor: pointer;
                .account {
                    margin-right: 10px;
                }
            }
        }
    }
    
    .breadcurmbs {
        margin-left: 20px;
        margin-top: 10px;
    }
}
</style>
