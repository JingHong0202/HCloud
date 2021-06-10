<template>
	<video id="preview-video" class="video" :title="data.fileName" object-fit='fill' enable-play-gesture vslide-gesture
		show-fullscreen-btn='false' :poster='poster' show-mute-btn
		src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/3c1782e0-60ab-11eb-8ff1-d5dcf8779628.m4v" http-cache
		controls></video>
</template>

<script>
	import {
		preview
	} from '@/api/file.js'
	export default {
		props: {
			autoplay: {
				type: Boolean,
				default: false
			},
			src: {
				type: [String],
				default: ''
			},
			autoScreenFull: {
				type: Boolean,
				default: true
			},
			data: {
				type: Object,
				default: {}
			}
		},
		data() {
			const vctx = uni.createVideoContext('preview-video');
			return {
				vctx
			};
		},
		computed: {
			poster() {
				return preview(this.data.uuid)
			}
		},
		methods: {
		}
	};
</script>

<style lang="scss">
	.video {
		flex: 1;
		position: absolute;
		left: 0;
		right: 0;
		top: 25px;
		bottom: 0;
	}
</style>
