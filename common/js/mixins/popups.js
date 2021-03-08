export default {
	data () {
		uni.preloadPage({
			url: "/pages/global/views-drawer/views-drawer"
		})
		return {
			openMenu: false,
			filter: 'all',
			labels: [{
				labelText: '视图',
				iconEncode: "\ueab6",
				handleClick: () => {
					uni.navigateTo({
						url: "/pages/global/views-drawer/views-drawer",
						success: () => {
							uni.$on('filter-list', (val) => {
								this.filter = val
							})
						}
					})
				}
			}, ]
		}
	}
}