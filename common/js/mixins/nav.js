export default  {
	methods: {
		toAccount() {
			uni.navigateTo({
				url: '/pages/account/account'
			})
		},
		toSearch() {
			uni.navigateTo({
				url: '/pages/search/search'
			})
		}
	}
}