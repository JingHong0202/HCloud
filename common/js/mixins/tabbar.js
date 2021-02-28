export default {
	watch: {
		"$store.state.file.selectlist"(newVal, oldVal) {
			if (!newVal.length) {
				this.nav.hide()
				this.TOGGLE_ACTION(false)
				this.$forceUpdate()
				setTimeout(() => {
					uni.showTabBar().then(() => {
						uni.$emit('showTabBar')
					})
				}, 100)
			} else {
				this.nav.draw([{
					tag: 'font',
					id: 'title',
					text: `已选择${newVal.length}项`,
					textStyles: {
						size: '16px',
						color: 'white'
					},
					position: {
						bottom: '0px',
						height: '44px'
					}
				}])
				this.nav.show();
				uni.hideTabBar().then(() => {
					setTimeout(() => {
						this.TOGGLE_ACTION(true)
						this.$forceUpdate()
					}, 100)
				});

			}
			this.CHANGE_SELECT_LIST(newVal)
		}
	}
}
