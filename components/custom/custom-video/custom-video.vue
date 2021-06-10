<template>
	<video id="preview-video" class="video" :title="data.fileName" v-if='url' :src="url" http-cache='true' controls
		enable-play-gesture show-mute-btn :poster="poster" vslide-gesture :initial-time='initTime' @pause='pause'
		@timeupdate='({detail:{currentTime}}) => current = currentTime'></video>
</template>

<script>
	import {
		preview,
		signatureUrl
	} from '@/api/file.js'
	export default {
		props: {
			autoplay: {
				type: Boolean,
				default: true
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
				vctx,
				url: null,
				initTime: uni.getStorageSync(`preview-${this.data.uuid}`) || 0
			};
		},
		destroyed() {
			uni.setStorageSync(`preview-${this.data.uuid}`, this.current)
		},
		computed: {
			poster() {
				return preview(this.data.uuid)
			}
		},
		async mounted() {
			this.url = (await signatureUrl(this.data.uuid)).data.data
		},
		methods: {
			pause(e) {
				uni.setStorageSync(`preview-${this.data.uuid}`, this.current)
			},
			playHandle({
				detail
			}) {
				if (this.autoScreenFull) this.vctx.requestFullScreen();
			}
		}
	};
</script>

<style lang="scss">
	.video {
		flex: 1;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
</style>
