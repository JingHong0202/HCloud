<template>
	<view class="custom-status" :style="{height: statusBarHeight}">
		
	</view>
</template>

<script>
	export default {
		data () {
			return {
				statusBarHeight: 25
			}
		},
		mounted() {
			this.statusBarHeight = plus.navigator.getStatusbarHeight();
		}
	}
</script>

<style scoped lang="scss">
</style>
