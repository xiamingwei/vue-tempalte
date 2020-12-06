<template>
    <div class="upload-image flex-v">
        <label v-if="!isOnlySee" for="upload-file" class="upload-btn">
            <Icon type="ios-cloud-upload-outline" />
            <span>上传图片</span>
        </label>
        <input id="upload-file" v-show="false" type="file" @change="readFile($event)" />
        <img v-if="imgSrc" :src="imgSrc" class="upload-img" :width="width" :height="height" />
    </div>
</template>

<script>
    export default {
        name: 'upload-image',
        props: {
            value: {
                type: String,
                default: ''
            },
            quality: { //图片压缩比例
                type: Number,
                default: 0.5
            },
            isOnlySee: {
                type: Boolean,
                default: false
            },
            width: {
                type: Number,
                default: 50
            },
            height: {
                type: Number,
                default: 50
            }
        },
        data() {
            return {
                imgSrc: this.value
            }
        },
        methods: {
            readFile(e) {
                let file = e.target.files[0];

                //选择文件后,再点取消,file会成undefined
                if (typeof file === 'undefined') {
                    return
                }

                //判断类型是不是图片 
                if (!/image\/\w+/.test(file.type)) {
                    this.$Message.warning({
                        background: true,
                        content: '请选择图片类型！'
                    })
                    return 
                }

                let imageTypes = ['png', 'jpg', 'jpeg'];
                let imageType = file.type.split('/')[1];

                if (!imageTypes.includes(imageType)) {
                    this.$Message.warning({
                        background: true,
                        content: '图片类型只能png、jpg、jpeg格式！'
                    })
                    return;
                }


                let that = this
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    that.dealImage(this.result, { quality: that.quality }, function(base) {
                        //调用
                        let blob = that.dataURLtoBlob(base);
                        let newFile = new File([blob], file.name, { type: file.type });
                        let r = new FileReader(); //本地预览
                        r.onload = function() {
                            that.imgSrc = r.result
                        }
                        r.readAsDataURL(newFile); //Base64
                        // 解决同一文件上传不触发onchange事件
                        document.getElementById('upload-file').value = null;
                        that.$emit('getImageFile', newFile)
                    });
                }
            },
            //将base64转换为blob
            dataURLtoBlob(dataurl) {
                let arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            },
            /**
             * 图片压缩，默认同比例压缩
             * @param {Object} path
             * pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
             * @param {Object} obj
             * obj 对象 有 width， height， quality(0-1)
             * @param {Object} callback
             * 回调函数有一个参数，base64的字符串数据
             */
            dealImage(path, obj, callback) {
                let img = new Image();
                img.src = path
                img.onload = function() {
                    let that = this;
                    // 默认按比例压缩
                    let w = that.width,
                        h = that.height,
                        scale = w / h;
                    w = obj.width || w;
                    h = obj.height || (w / scale);
                    let quality = obj.quality || 0.7; // 默认图片质量为0.7
                    //生成canvas
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    // 创建属性节点
                    let anw = document.createAttribute("width");
                    anw.nodeValue = w;
                    let anh = document.createAttribute("height");
                    anh.nodeValue = h;
                    canvas.setAttributeNode(anw);
                    canvas.setAttributeNode(anh);
                    ctx.drawImage(that, 0, 0, w, h);
                    // 图像质量
                    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                        quality = obj.quality;
                    }
                    // quality值越小，所绘制出的图像越模糊
                    let base64 = canvas.toDataURL('image/jpeg', quality);
                    // 回调函数返回base64的值
                    callback(base64);
                }
            }
        },
        watch: {
            value(val) {
                this.imgSrc = val;
            },
            imgSrc(val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style lang="less" scoped>
    .upload-image {

        .upload-btn {
            width: 80px;
            height: 32px;
            background: #57a3f3;
            border: 1px solid #57a3f3;
            cursor: pointer;
            color: @white;
            text-align: center;
            line-height: 32px;
            border-radius: 5px;

            span {
                margin-left: 3px;
            }
        }

        .upload-img {
            margin-top: 10px;
        }
    }
</style>