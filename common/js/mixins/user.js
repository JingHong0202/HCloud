export default {
	computed: {
		isMobile() {
			return /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/
				.test(this.mobile)
		}
	},
	methods: {
		logout() {
			uni.$showModal({
				concent: '确定要退出登录吗?',
				align: 'center'
			}).then(res => {
				uni.removeStorageSync('token')
				uni.removeStorageSync('userinfo')
				uni.reLaunch({
					url: '/pages/user/login/login'
				})
			}).catch((res) => {
				this.$hide()
			})
		}
	}
}
