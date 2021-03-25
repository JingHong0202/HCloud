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
		@include position(absolute,0,0,0,0)
	}
	.no-image {
		@extend %flex;
	}
</style>
