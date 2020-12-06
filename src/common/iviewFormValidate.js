
import { validateSfssPassword, validateSfssPhone, validateSfssEmail } from '@/common/validate'
/**
 * iview表单校验
 */
export const validatePassword = (rule, value, callback) => {
    if(value && !validateSfssPassword(value)){
        return callback(new Error('请输入正确的密码格式'))
    }
    else {
        callback()
    }
}
export const validatePhone = (rule, value, callback) => {
    if(value && !validateSfssPhone(value)){
        return callback(new Error('请输入正确的手机格式'))
    }
    else {
        callback()
    }
}
export const validateEmail = (rule, value, callback) => {
    if(value && !validateSfssEmail(value)){
        return callback(new Error('请输入正确的邮箱格式'))
    }
    else {
        callback()
    }
}
