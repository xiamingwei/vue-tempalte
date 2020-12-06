/**
 * 混合用法，每个页面后台的分页信息都是一样的。引入一个组件中使用，且不会影响其他组件
 */

const list = {
    data() {
        return {
            tableInfo: {
                current: 1,
                pageSize: 10,
                total: 0,
                loading: false,
            }
        }
    }
  }

export default list