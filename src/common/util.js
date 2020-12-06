import iView from 'iview'
let Decimal = require('decimal.js')
/**
 * 初始化echarts 
 */
export function setChart(id, option, isNotMerge = true) {
    let chartId = document.getElementById(id)
    let myChart = echarts.init(chartId)
    if (option) {
        myChart.setOption(option, isNotMerge)
        window.addEventListener('resize', throttle(myChart.resize, 50))
    } else {
        // 侧边菜单栏收缩展开动画的时间
        const SIDE_OPEN_CLOSE_TIME = 200
        setTimeout(() => {
            myChart.resize()
        }, SIDE_OPEN_CLOSE_TIME)
    }
}

export function EncodeGetUrl(url) {
    let urlArr = url.split('?');
    let encodeUrl = urlArr[0];

    if (urlArr.length > 1) {
        encodeUrl += '?';
        let paramArr = urlArr[1].split('&');
        let encodeparamArr = [];
        paramArr.forEach((item, index) => {
            let key = item.split('=')[0];
            let value = item.split('=')[1];
            encodeparamArr.push(key + '=' + encodeURIComponent(value));
        })
        
        encodeUrl += encodeparamArr.join('&');
    }

    return encodeUrl;
}

export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone');
    }

    const targetObj = source.constructor === Array ? [] : {};

    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys]);
        }
        else {
            targetObj[keys] = source[keys];
        }
    })

    return targetObj;
}

export function formatDate(value, fmt) {
    if (!value) {
        return '-';
    }

    let date = new Date(value);

    if (date === 'Invalid Date') {
        date = new Date(parseFloat(value));
    }
    
    if (!fmt) {
        fmt = 'yyyy-MM-dd hh:mm:ss';
    }

    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }

    return fmt;
}

export function debounce(fun, delay = 500) {
    let last, ctx, args;

    return function() {
        ctx = this;
        args = arguments;
        clearTimeout(last);
        last = setTimeout(function() {
            fun.apply(ctx, args)
        }, delay);
    }
}

export function throttle(fun, delay) {
    let last, ctx, args;

    return function() {
        ctx = this;
        args = arguments;

        if (!last) {
            fun.apply(ctx, args);
            last = setTimeout(function() {
                last = undefined;
            }, delay)
        }
    }
}


export function emptyTo(value) {
    if (value === '' || value === null || value === undefined) {
        return '-';
    } 
    else {
        return value;
    }
}

/**
 * 
 * @param  data 数据流
 * @param  fileName 文件名
 */
export function downloadFile(data, fileName = "") {
    if (data.data.type == "application/json" || data.data.type == "text/html;charset=utf-8") {
        let reader = new FileReader();
        reader.readAsText(data.data);
        reader.onload = function(res) {
            iView.Notice.error({
                title: '操作失败',
                desc: JSON.parse(res.target.result).message,
            })
        }
    } 
    else {
        let contentDisposition = data.headers["content-disposition"].split(";");
        let fileSuffix = "";

        for (let i = 0; i < contentDisposition.length; i++) {
            let item = contentDisposition[i];
            item = item.replace(/\"/g, "");

            if (item.includes("filename=")) {
                let temp = item.split(".");
                fileSuffix = temp[temp.length - 1];
                break;
            }
        }

        if (!fileSuffix) {
            iView.Notice.error({
                title: '操作失败',
                desc: "下载失败",
            })
        }

        let blob = new Blob([data.data]);
        if(window.navigator.msSaveOrOpenBlob){
            //ie使用的下载方式
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName + "." + fileSuffix;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

/**
 * 根据权限生成侧边菜单栏
 * @param {*} menus 
 * @param {*} codes 
 */
export function setMenus(menus, codes) {
    let accessedMenus = []

    menus.forEach(menu => {
        if (menu.children) {
            let temp = deepClone(menu)
            temp.children = []

            menu.children.forEach(child => {
                if (codes.includes(child.meta.code)) {
                    temp.children.push(child)
                }
            })
            
            temp.children.length && accessedMenus.push(temp)
        } else {
            codes.includes(menu.meta.code) && accessedMenus.push(menu)
        }
    })

    return accessedMenus
}

/**
 * 根据权限生成面包屑
 */
export function setBreadcrumb(accessedMenus) {
    let breadcrumbObj = {}
    
    accessedMenus.forEach(accessedMenu => {
        if (accessedMenu.children && accessedMenu.children.length) {
            accessedMenu.children.forEach(child => {
                breadcrumbObj[child.path] = `${accessedMenu.meta.title} > ${child.meta.title}`
            })
        } else {
            breadcrumbObj[accessedMenu.path] = `${accessedMenu.meta.title} > ${accessedMenu.meta.title}`
        }
    })

    return breadcrumbObj
}


// 转化后台字段为Tree可用
export function tranverseTree(datas) {
    let nodes = []

    datas.forEach((data, index) => {
        nodes.push({
            id: data.id,
            title: data.name,
            checked: data.checked,
            expand: true,
            disabled: data.disabled ? data.disabled : false
        })
        nodes[index].children = []

        data.subNodeList.length && data.subNodeList.forEach(child => {
            nodes[index].children.push({
                id: child.id,
                title: child.name,
                checked: child.checked,
                expand: true,
                disabled: child.disabled ? child.disabled : false
            })
        })
    })

    return nodes
}

export const calcUtil = {
    add: (x, y) => {
        return Number(Decimal.add(x, y))
    },
    sub: (x, y) => {
        return Number(Decimal.sub(x, y))
    },
    mul: (x, y) => {
        return Number(Decimal.mul(x, y))
    },
    div: (x, y) => {
        return Number(Decimal.div(x, y))
    }
}

/**
 * 处理查询undefined
 */
export function dealUndefined(field) {
    if (typeof field === 'undefined') {
        field = ''
    }
    return field
}

/**
 * 后台传分, 转化为元
 */
export function formatPrice(price) {
    if (!price && price != 0) {
        return '-'
    } else if (price == 0) {
        return `￥0.00`;
    } else {
        return `￥${calcUtil.div(price, 100).toFixed(2)}`
    }
}