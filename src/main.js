import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import service from '@/service'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import '@/styles/index.less'
import * as filters from '@/filters'
import '@/components'

Vue.prototype.filters = filters;
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(ViewUI);

Vue.prototype.service = service;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
