/**
 * 用户相关api
 */
import http from '@/util/luch-request/index.js'

// 通用请求方法middleware 演示。文档：https://www.quanzhan.co/luch-request/guide/3.x/#middleware


/**
 * 注册用户
 * @param {Object} data - 签名手机号密码
 */
export const register = (data) => {
	return http.middleware({
		method: 'POST', // 必须大写
		url: '/users',
		data,
		custom: {
			loading: {
				title: '注册提交中...'
			}
		}
	})
}

/**
 * 修改用户
 * @param {Object} data - 签名手机号密码
 * @param {String} params - base64(mobile) || token
 */
export const update = (data,params) => {
	return http.middleware({
		method: 'PUT', // 必须大写
		url: '/users/' + params,
		data,
		custom: {
			loading: {
				title: '提交中...'
			}
		}
	})
}

/**
 * 用户登录
 * @param {Object} data - 查询数据
 */
export const login = {
	/**
	 * 账号密码登录
	 * @param {Object} data - 账号密码
	 */
	account: (data) => {
		return http.middleware({
			method: 'POST', // 必须大写
			url: '/login.account',
			data,
			custom: {
				loading: {
					title: '登录中...'
				}
			}
		})
	},
	/**
	 * 短信验证登录
	 * @param {Object} data - 验证码手机号
	 */
	verify: (data) => {
		return http.middleware({
			method: 'POST', // 必须大写
			url: '/login.verify',
			data,
			custom: {
				loading: {
					title: '登录中...'
				}
			}
		})
	}
}

/**
 * 发送短信
 * @param {Object} data - 手机号-行为
 */
export const send = (data) => {
	return http.middleware({
		method: 'POST', // 必须大写
		url: '/sendCode',
		data,
		custom: {
			loading: {
				title: '发送短信中...'
			}
		}
	})
}

/**
 * 校验验证码
 * @param {Object} data - 短信验证码手机号
 */
export const verify = (data) => {
	return http.middleware({
		method: 'POST', // 必须大写
		url: '/verifyCode',
		data,
		custom: {
			loading: {
				title: '提交处理中...'
			}
		}
	})
}


/**
 * 获取用户信息
 */
export const get_user_detail = () => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/user.detail',
		custom: {
			auth: true
		}
	})
}



