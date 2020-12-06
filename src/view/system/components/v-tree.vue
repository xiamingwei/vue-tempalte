<template>
    <div id="v-tree">
        <div class="nodes">
            <div v-for="node in nodes" :key="node.path" :class="nodeStyle">
                <p class="one-node">
                    <Icon type="ios-arrow-down" v-show="node[options.recursion] && node[options.recursion].length && node[options.expandLabel]" @click="expand(node)" class="expand-icon" />
                    <Icon type="ios-arrow-forward" v-show="node[options.recursion] && node[options.recursion].length && !node[options.expandLabel]" @click="expand(node)" class="shrink-icon" />
                    <span @click="selectNode(node)" @click.right.prevent="e => { getMousePos(e); showOperateMenu(node) }" class="node-name">{{node[options.label]}}</span>
                </p>
                <div v-if="node[options.recursion] && node[options.recursion].length" v-show="node[options.expandLabel]">
                    <v-tree :nodes="node[options.recursion]" :level="level + 1" :options="options"></v-tree>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vTree',
        inject: ['showOperateMenu', 'getMousePos', 'selectNode'],
        props: {
            nodes: {
                type: Array,
            },
            level: {
                type: Number,
                default: 1
            },
            options: {
                type: Object,
                default: () => {
                    return {
                        menuList: [],
                        recursion: 'children',
                        label: 'name',
                        expandLabel: 'expand'
                    }
                }
            }
        },
        computed: {
            nodeStyle() {
                return this.level > 1 ? 'node' : 'root'
            }
        },
        methods: {
            expand(node) {
                node.expand = !node.expand
            },
        },
    }
</script>

<style lang="less" scoped>
    #v-tree {

        .nodes {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 15px;

            .root {
                position: relative;
                padding: 3px 3px;
            }

            .node {
                position: relative;
                padding: 3px 3px;
            }

            .one-node {
                cursor: pointer;
                text-align: left;

                .operation-icon {
                    position: absolute;
                    cursor: pointer;
                    left: -10px;
                    top: 8px;
                }

                .expand-icon {
                    .operation-icon();
                    font-size: 12px;
                }

                .shrink-icon {
                    .operation-icon();
                    font-size: 13px;
                }

                .node-name {
                    padding: 1px 4px;

                    &:hover {
                        background: #e6f7ff;
                    }
                }

                .seleced-node {
                    background: #bae7ff;
                }
            }

            .operate-menu {
                position: absolute;
                width: inherit;
                top: 5px;
                left: 5px;
                background-color: #fff;
                box-sizing: border-box;
                border-radius: 4px;
                box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
                z-index: 900;

                p {
                    height: 20px;
                    padding: 0 10px;
                    border-bottom: 1px solid #ccc;
                }
            }
        }
    }
</style>