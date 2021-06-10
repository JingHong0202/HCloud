import Request from './core/Request'



const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('token')
	} catch (e) {}
	return token
}

const getNetWorkType = () => {
	return new Promise((resolve, reject) => {
		uni.getNetworkType({
			success: function(res) {
				resolve(res)
			},
			fail: function(res) {
				reject(res)
			}
		});
	})
}

const http = new Request()
http.setConfig((config) => {
	/* 设置全局配置 */
	config.header = {
		...config.header,
	}
	// config.custom = {
	// 	loading: true
	// }
	return config
})


http.interceptors.request.use(async (config) => {
	const {
		custom
	} = config
	if ((await getNetWorkType()).networkType === 'none') return Promise.reject('网络环境不可用')


	/* 请求之前拦截器。可以使用async await 做异步操作 */
	config.header = {
		...config.header,
		// authorization: getTokenStorage()
	}
	if (custom.auth) {
		const authorization = getTokenStorage()
		if (!authorization) {
			return uni.redirectTo({
				url: "/pages/user/login/login"
			})
		}
		config.header.authorization = authorization
	}
	if (custom.loading) uni.showLoading({
		title: config.custom.loading.title,
		mask: true
	})
	return config
}, (config) => {
	return Promise.reject(config)
})


http.interceptors.response.use(async (response) => {
	/* 请求之后拦截器。可以使用async await 做异步操作  */
	let resHeader = response.header
	// 每当token要过期时，后端响应头会带一个refresh-token字段,通过该字段即可无感应的刷新token
	if (resHeader['refresh-token']) {
		console.log(resHeader['refresh-token'])
		uni.setStorageSync('token', resHeader['refresh-token'])
	}

	uni.hideLoading()

	return response
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	console.log(response)
	let config = response.config
	if (config && config.custom.auth) {
		// 401 status 代表token失效或错误
		if (response.statusCode === 401) {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userinfo')
			getApp().globalData.navObj.hide()
			uni.showToast({
				title: '登录状态失效,请重新登录',
				position: 'bottom'
			})
			return uni.reLaunch({
				url: "/pages/user/login/login"
			})
		}
	}


	uni.hideLoading()

	uni.showToast({
		title: response.data ? (response.data.message === '参数错误' ? response.data.error : response
			.data.message) : response,
		position: 'bottom'
	})
	return Promise.reject(response)
})

export default http
