import idCardNoUtil from '@/common/idCard'
/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/*校验身份证*/
export function isIdCardNo(num) {
    console.log(num)
	num = num.toUpperCase();
	//身份证号码18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	if(idCardNoUtil.checkIdCardNo(num)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 运营管理系统邮箱校验
 * @param {*} email 
 */

export function validateSfssEmail(email) {
    const re = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return re.test(email)
}

/**
 * 运营管理系统密码校验
 * @param {*} password 
 */

export function validateSfssPassword(password) {
    const re = /^[A-Za-z0-9]+$/
    return re.test(password)
}

/**
 * 运营管理系统手机校验
 * @param {*} phone 
 */

export function validateSfssPhone(phone) {
    const re = /^1(3|4|5|7|8|9)\d{9}$/
    return re.test(phone)
}

/**
 * 相应名称只能为中文、数字、字母
 */ 
export const checkName = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/

/**
 * 产品名称 产品只能包含中英文，（，），—，/字符
 */ 
export const checkProductName = /^[a-zA-Z0-9\u4E00-\u9FA5\/\(\)\（\）\-]+$/

/**
 * 不包含有空格
 */
export const noSpace = /^[\S]+$/