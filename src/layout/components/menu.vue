<template>
    <div id="common-menu">
        <div class="change-icon">
            <Icon type="md-code"  size="25" style="cursor: pointer;" color="white" @click="expandMenu" />
        </div>
        <div class="index-side">
            <Menu width="auto" theme="dark" :active-name="active" :open-names="open" @on-select="route" accordion v-show="!isCollapsed">
                <div v-for="(menu, index) in menus" :key="index">
                    <div v-if="menu.children">
                        <Submenu :name="index + '-' + index" :key="index">
                            <span slot="title" class="flex flex-v-center">
                                <common-icon v-if="menu.icon" :type="menu.icon" :size="20" class="title-icon"></common-icon>{{ menu.meta.title }}
                            </span>
                            <MenuItem v-for="(c, i) in menu.children" :name="c.path" :key="i">
                            <common-icon v-if="c.icon" :type="c.icon" :size="20"></common-icon>
                            {{ c.meta.title }}
                            </MenuItem>
                        </Submenu>
                    </div>
                    <div v-else>
                        <MenuItem :name="menu.path" :key="index">
                        <common-icon v-if="menu.icon" :type="menu.icon" :size="20" class="menu-icon"></common-icon>
                        {{ menu.meta.title }}
                        </MenuItem>
                    </div>
                </div>
            </Menu>
            <div class="menu-collapsed flex-v flex-center" v-show="isCollapsed">
                <Dropdown trigger="hover" placement="right" v-for="(menu, index) in menus" :key="index" class="index-dropdown" @on-click="route">
                    <common-icon v-if="menu.icon" :type="menu.icon" :size="20" color="white"></common-icon>
                    <DropdownMenu slot="list" v-if="menu.children">
                        <DropdownItem v-for="(m, i) in menu.children" :key="i" :name="m.path">{{m.meta.title}}</DropdownItem>
                    </DropdownMenu>
                    <DropdownItem slot="list" v-else :name="menu.path">
                        {{menu.meta.title}}
                    </DropdownItem>
                </Dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'left-menu',
        props: {
            collapsed: {
                type: Boolean
            },
        },
        data() {
            return {
                open: [],
                isCollapsed: this.collapsed
            }
        },
        computed: {
            active: function() {
                return this.$route.path
            },
            ...mapGetters('user', [
                'menus',
            ])
        },
        created() {
            this.open = this.getOpen(this.active)
        },
        methods: {
            route(name) {
                name && this.$router.push(name)
            },
            // 展开侧边栏二级菜单
            getOpen(key) {
                let res = []
                this.menus.map((m, i) => {
                    if (m.children) {
                        m.children.map((c) => {
                            if (c.path == key) {
                                res.push(i + '-' + i)
                            }
                        })
                    }
                })
                return res
            },
            expandMenu() {
                this.isCollapsed = !this.isCollapsed;
                this.$emit('on-collapsed', this.isCollapsed)
            }
        }
    }
</script>

<style lang="less" scoped>
    @menuBgColor: #011b34;

    .change-icon {
        background: @menuBgColor;
        height: 47px;
        text-align: center;
        line-height: 47px;
    }

    .common-title {
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 17px;
        color: @white;
        font-weight: bold;
    }

    .index-side {
        height: 100%;
        background: @menuBgColor;
        width: auto;

        .title-icon {
            margin-top: 5px;
            margin-right: 15px;
        }

        .menu-icon {
            margin-top: 5px;
            margin-right: 10px;
        }

        .menu-expand {
            width: 200px;
        }

        .menu-collapsed {
            width: 60px;

            .index-dropdown {
                height: 45px;
                line-height: 45px;
                cursor: pointer;

                .ivu-select-dropdown {
                    left: 60px !important;
                }
            }
        }
    }
</style>

<style lang="less">
@menuFontColor: #9dc5d9; //菜单栏默认字体颜色
@menuActive: #1b6ab4; //菜单栏被选中菜单颜色
@menuBgColor: #011b34; //菜单栏背景色
@menuHoverBgColor: #0f3b5e; //菜单栏悬浮颜色
@childBgColor: #1a2226; //子菜单背景颜色

#common-menu {

    .ivu-icon-ios-arrow-down:before {
        font-size: 15px;
    }

    .ivu-menu {
        background: @menuBgColor;
    }

    .ivu-menu-submenu-title.ivu-menu-item {
        padding-left: 160px !important;
    }

    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 10px 40px;
    }

    .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
        background: @childBgColor !important;
        padding-left: 80px !important;
        
        &:hover {
            background: @menuHoverBgColor !important;
        }
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
        color: @menuFontColor;
        background: @menuBgColor;

        &:hover {
            color: @white;
            background: @menuHoverBgColor;
        }
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
        background: @menuActive;
        color: @white;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
        background: @menuActive !important;
        color: @white;
        &:hover {
            background: @menuHoverBgColor !important;
        }
    }
    
    .index-dropdown .ivu-select-dropdown{
            left: 60px !important;
    }

}
</style>