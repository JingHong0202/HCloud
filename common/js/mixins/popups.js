export default {
	data () {
		return {
			openMenu: false,
			filter: 'all',
			labels: [{
				labelText: '视图',
				iconEncode: "\ueab6",
				handleClick: () => {
					const drawer = uni.getSubNVueById('drawer')
					drawer.show('slide-in-left', 200, () => {
						uni.$on('filter-list', (val) => {
							this.filter = val
						})
					})
				}
			}, ]
		}
	}
}