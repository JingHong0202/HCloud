export default {
	watch: {
		"$store.state.file.selectlist"(newVal, oldVal) {
			if (!newVal.length) {
				this.nav.hide()
				this.TOGGLE_ACTION(false)
				this.$forceUpdate()
				uni.$emit('showTabBar')
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
				this.TOGGLE_ACTION(true)
				this.$forceUpdate()

			}
			this.CHANGE_SELECT_LIST(newVal)
		}
	}
}
