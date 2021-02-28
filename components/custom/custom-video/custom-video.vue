<template>
	<video id="preview-video" :autoplay="autoplay" :src="src" :style="{ width, height }"  http-cache controls  @play='playHandle' ></video>
</template>

<script>
export default {
	props: {
		width: {
			type: [String, Number]
		},
		height: {
			type: [String, Number]
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		src: {
			type: [String],
			default: ''
		},
		autoScreenFull:{
			type: Boolean,
			default: true
		}
	},
	data() {
		const vctx = uni.createVideoContext('preview-video');
		return {
			vctx
		};
	},
	methods: {
		playHandle () {
			if (this.autoScreenFull) this.ScreenFull()
		},
		ScreenFull() {
			return this.vctx.requestFullScreen();
		}
	}
};
</script>

<style lang="scss"></style>
