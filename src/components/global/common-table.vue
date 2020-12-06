<template>
    <div class="common-table">
        <Table :columns="columns" :data="datas" :loading="tableInfo.loading" @on-selection-change="onSelectionChange" stripe></Table>
        <div class="common-page">
            <Page :current="tableInfo.current" :total="tableInfo.total" :page-size="tableInfo.pageSize" :transfer="true" show-total show-sizer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
    </div>
</template>

<script>
export default {
    name: 'common-table',
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        datas: {
            type: Array,
            default: () => []
        },
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    current: 1,
                    pageSize: 10,
                    loading: false,
                    total: 0
                }
            }
        }
    },
    methods: {
        changePage(page = 1) {
            this.$emit('changePage', page)
        },
        changePageSize(pageSize) {
            this.tableInfo.pageSize = pageSize
            this.changePage()
        },
        onSelectionChange(val) {
            this.$emit('on-selection-change', val)
        }
    }
}
</script>

<style lang="less" scoped>
.common-table {
    margin-top: 20px;

    /deep/ .ivu-btn {
        padding: 0 8px;
        height: 30px;
        line-height: 30px;
        margin-left: 5px;
    }

    .common-page {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>