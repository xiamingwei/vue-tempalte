import axios from 'axios';
import iView from 'view-design'
import router from '@/router'
import store from '@/store'
import { EncodeGetUrl } from '@/common/util'
const notLoginCode = 400;
const timeout = 30000;
const UPDATE_PASSWORD = 300 // 强制修改密码
const RESPONSE_SUCCESS_CODE = "00"

// http request 拦截器
axios.interceptors.request.use(
    config => {
        config.timeout = timeout;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.responseCode == notLoginCode) {
            store.commit('user/setLogin', false);
            router.replace('/login');
            return Promise.reject(response);
        } else if (response.data.responseCode == UPDATE_PASSWORD) {
            router.replace('/update-password');
            iView.Notice.error({desc:response.data.responseMsg});
            return Promise.reject(response);
        }
        return response;
    },
    error => {
        iView.Notice.error({
            desc: '网络错误',
            duration: 2
        })
    }
)

let httpMethod = {
    getService: (url, config = {}, no_loading = false) => {
        url = EncodeGetUrl(url)
        return new Promise((resolve, reject) => {
            !no_loading && iView.LoadingBar.start()
            axios
                .get(url, config)
                .then((response) => {
                    !no_loading && iView.LoadingBar.finish()
                    if ((response.data && response.data.responseCode === RESPONSE_SUCCESS_CODE) && config.responseBlob !== 'blob') {
                        resolve(response.data)
                    }
                    else if (config.responseBlob === 'blob') {
                        resolve(response)
                    }
                    else {
                        response.data.responseMsg && iView.Notice.error({desc:response.data.responseMsg});
                        reject(response.data)
                    }
                })
                .catch((error) => {
                    !no_loading && iView.LoadingBar.finish();
                    reject(error);
                })
        })
    },
    postService: (url, data, config = {},  no_loading = false) => {
        return new Promise((resolve, reject) => {
            !no_loading && iView.LoadingBar.start()
            axios
                .post(url, data, config)
                .then((response) => {
                    !no_loading && iView.LoadingBar.finish()
                    if (response.data && response.data.responseCode === RESPONSE_SUCCESS_CODE) {
                        resolve(response.data)
                    }
                    else if(config.responseType && config.responseType == "blob") {//post下载文件
                        resolve(response)
                    }
                    else {
                        response.data.responseMsg && iView.Notice.error({desc:response.data.responseMsg});
                        reject(response.data)
                    }
                })
                .catch((error) => {
                    !no_loading && iView.LoadingBar.finish();
                    reject(error);
                })
        })
    },
    putService: (url, data, config = {}, no_loading = false) => {
        !no_loading && iView.LoadingBar.start()
        return new Promise((resolve, reject) => {
            axios
                .put(url, data, config)
                .then((response) => {
                    !no_loading && iView.LoadingBar.finish()
                    if (response.data && response.data.responseCode === RESPONSE_SUCCESS_CODE) {
                        resolve(response.data)
                    }
                    else {
                        response.data.responseMsg && iView.Notice.error({desc:response.data.responseMsg});
                        reject(response.data)
                    }
                })
                .catch((error) => {
                    !no_loading && iView.LoadingBar.finish();
                    reject(error)
                })
        })
    },
    deleteService: (url, config = {}, no_loading = false) => {
        !no_loading && iView.LoadingBar.start()
        return new Promise((resolve, reject) => {
            axios.delete(url)
                .then((response) => {
                    !no_loading && iView.LoadingBar.finish()
                    if (response.data && response.data.responseCode === RESPONSE_SUCCESS_CODE) {
                        resolve(response.data)
                    }
                    else {
                        response.data.responseMsg && iView.Notice.error({desc:response.data.responseMsg});
                        reject(response.data)
                    }
                })
                .catch((error) => {
                    !no_loading && iView.LoadingBar.finish();
                    reject(error)
                })
        })
    }
}

export default httpMethod