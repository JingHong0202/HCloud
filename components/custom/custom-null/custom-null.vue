<template>
	<view class="noCtx">
		<image class="no-image" src="/static/images/null.png" mode="aspectFit">
		</image>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style scoped lang='scss'>
	.noCtx {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}
	.no-image {
		flex: 1;
	}
</style>
