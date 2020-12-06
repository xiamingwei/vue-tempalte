<template>
    <div id="yi-ballet" class="yi-main flex-v">
        <div class="yi-main-wrapper flex-h">
            <Sider hide-trigger collapsible :collapsed-width="60" v-model="isCollapsed" class="side-back">
                <side :collapsed="isCollapsed" @on-collapsed="handleCollapsedChange"></side>
            </Sider>
            <div class="yi-main-wrapper-right flex-grow flex-v">
                <header-bar></header-bar>
                <div class="yi-main-content flex-grow flex-v">
                    <div class="content-wrapper flex-grow">
                        <keep-alive :include="cacheRouters">
                            <router-view />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import HeaderBar from './components/header-bar'
    import side from './components/menu'
    import menus from '@/router/menu.js'
    import { mapMutations } from 'vuex'
    import { deepClone } from '@/common/util.js'
    export default {
        name: 'Main',
        components: {
            side,
            HeaderBar
        },
        data() {
            return {
                isCollapsed: false,
            }
        },
        computed: {
            cacheRouters() {
                return this.$store.getters["routerStack/getCacheRouters"]
            },
        },
        methods: {
            handleCollapsedChange(data) {
                this.isCollapsed = data;
            },
        },
    }
</script>
<style lang="less" scoped>
    @import '~@/styles/mixin.less';

    .yi-main {
        position: relative;
        width: 100%;
        height: 100%;

        &-wrapper {
            position: relative;
            width: 100%;
            height: 100%;

            .side-back {
                background: #011b34;
            }

            &-right {
                width: 0;
                min-width: 0;

                .yi-main-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;

                    .content-wrapper {
                        width: 100%;
                        height: 0;
                        position: relative;
                        padding: 20px;
                        box-sizing: border-box;
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                }
            }
        }
    }
</style>