<template>
    <div class="search-tools">
        <div class="search-tools-part">
            <slot name="query-row"></slot>
            <div class="search-tools-btn">
                <Button type="primary" @click="query">
                    <Icon type="ios-search" size="15"></Icon>
                    <span>查询</span>
                </Button>
                <Button @click="query">
                    <Icon type="md-refresh"></Icon>
                    <span>重置</span>
                </Button>
                <slot name="custom-btn"></slot>
                <Button v-if="advancedQuery" @click="isAdvancedQuery = !isAdvancedQuery">
                    <Icon type="ios-arrow-down" :class="[isAdvancedQuery ? 'rotate' : '', 'rotate-transition']"></Icon>
                    <span>{{isAdvancedQuery ? '收起' : '展开'}}</span>
                </Button>
            </div>
        </div>
        <div v-show="isAdvancedQuery">
            <slot name="row"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "search-bar",
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        advancedQuery: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isAdvancedQuery: false,
            queryObj: this.value
        };
    },
    methods: {
        dealUndefined(queryObj = { ...this.queryObj }) {
            //vue-design Select清空会导致属性变为undefined, 再次统一处理。
            for (let [key, value] of Object.entries(queryObj)) {
                if (typeof value === "undefined") {
                queryObj[key] = "";
                }
            }

            return queryObj;
        },
        query() {
            this.queryObj = this.dealUndefined();
                this.$emit("getList");
            },
        reset() {
            for (let i in this.queryObj) {
                this.queryObj[i] = "";
            }

            this.queryObj = this.dealUndefined();
            this.$emit("getList");
        }
    },
    watch: {
        value(val) {
            this.queryObj = val;
        },
        queryObj(val) {
            this.$emit("input", val);
        }
    }
};
</script>

<style lang="less" scoped>
.search-tools {
    border-bottom: 1px solid #eee;

    .search-tools-part {
        .flex();
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 20px;
        &:last-child {
            margin: 0;
        }
        .ivu-input-wrapper,
        .ivu-select {
            width: auto;
        }
    }

    .search-tools-handle {
        display: flex;
        align-items: center;
        padding-right: 2px;
        label {
            width: 70px;
            text-align: right;
            font-size: 12px;
            font-weight: 200;
            color: #515A6E;
        }
        input {
            width: 180px;
        }
        .width {
            width: 180px;
        }
    }

    .search-tools-btn {
        .flex-grow();
        .flex();
        height: 30px;
        text-align: right;
        margin-right: 15px;

        button {
            padding: 0 8px;
            margin-left: 10px;

            i {
                margin-right: 3px;
            }
        }
    }

    .rotate-transition {
        transition: all ease 0.5s;
        &:hover {
            cursor: pointer;
        }
    }

    .rotate {
        transform: rotate(90deg);
    }
}
</style>