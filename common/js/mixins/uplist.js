import {
	mapState,
	mapGetters
} from 'vuex'

import {
	formatBytes,
	randomString
} from '@/util/file.js'

import {
	getoss,
	check
} from '@/api/file.js'

import {
	Base64
} from '@/util/base64.js';

import {
	throttle
} from '@/util/index.js'

import oss_config from '@/config/oss.js'
export default {
	computed: {
		...mapState('file', ['uplist']),
		...mapGetters('file', ['GET_UPLIST_LOADING'])
	},
	methods: {
		async beforeUpload(item) {
			if (item.uploading) return
			item.uploading = true
			let user = getApp().globalData.userinfo,
				oss_cache = uni.getStorageSync(`${user.mobile}-oss-signature`)
			// 在上传之前,检查服务端有没有同样的MD5,有则进行秒传流程,没有则进行请求服务端签名再执行正常的上传流程,检查通过后，文件不存在则响应一个签名
			const {
				exist,
				sign,
				repeat
			} = (await check(item.md5, item.file_id, item.fileName, item.size)).data.data
			if (exist || repeat) return {
				exist,
				repeat
			}
			if (oss_cache && (new Date().getTime() < oss_cache.expire)) {
				var {
					signature,
					policy,
					host,
					OSSAccessKeyId,
					startsWith,
				} = oss_cache
			} else {
				var {
					data: {
						signature,
						policy,
						host,
						OSSAccessKeyId,
						startsWith,
					}
				} = (await getoss()).data;
				uni.setStorageSync(`${user.mobile}-oss-signature`, {
					signature,
					policy,
					host,
					OSSAccessKeyId,
					startsWith,
					expire: new Date().getTime() + 180000
				})
			}
			return {
				signature,
				policy,
				host,
				OSSAccessKeyId,
				startsWith,
				user,
				exist,
				sign,
				repeat
			}
		},
		async handlerUp() {
			for (let item of this.uplist) {


				// 只有状态是LOADING才进行上传
				if (item.status !== "LOADING") continue;

				const {
					signature,
					policy,
					host,
					OSSAccessKeyId,
					startsWith,
					user,
					exist,
					sign,
					repeat
				} = await this.beforeUpload(item)

				if (repeat) {
					uni.showToast({
						title: item.fileName + '文件重复',
						position: 'bottom'
					})
					item.uploading = false
					return this.$set(item, 'status', 'ERROR')
				}

				// 秒传
				if (exist && !sign) {
					this.$set(item, 'percent', 100)
					this.$set(item, 'currentSize', formatBytes(item.size))
					item.uploading = false
					return this.$set(item, 'status', 'SUCCESS')
				}

				try {
					if (this.uplist.filter(item => item.status === 'RUNTIME').length) return
					this.$set(item, 'status', 'RUNTIME')
					let res = await this.upload(item, {
						signature,
						policy,
						host,
						OSSAccessKeyId,
						startsWith,
						user,
						sign
					})
					item.uploading = false
					item.uuid = res.data.uuid
					item.file_id = res.data.file_id
				} catch (e) {
					console.log(e)
					item.uploading = false
					this.$set(item, 'status', 'ERROR')
				}
			}
		},
		upload(item, {
			signature,
			policy,
			host,
			OSSAccessKeyId,
			startsWith,
			user,
			sign
		}) {
			return new Promise((resolve, reject) => {
				item.task = uni.uploadFile({
					url: host,
					filePath: item.url,
					name: 'file',
					formData: {
						'key': startsWith + '-' + randomString(item.fileName.length),
						'policy': policy,
						'OSSAccessKeyId': OSSAccessKeyId,
						'success_action_status': '200', //让服务端返回200,不然，默认会返回204
						'Signature': signature,
						'callback': Base64.encode(
							JSON.stringify({
								callbackUrl: oss_config.OSS_CALLBACK_HOST,
								callbackBody: "bucket=${bucket}&object=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&mobile=${x:mobile}&file_id=${x:file_id}&file_name=${x:file_name}&sign=${x:sign}"
							})
						),
						'x:mobile': user.mobile,
						'x:file_id': item.file_id || '',
						'x:file_name': item.fileName,
						'x:sign': sign
					},
					success: (res) => {
						if (res.statusCode === 200) {
							let data = JSON.parse(res.data.replace(/\\/, ''))
							if (data.message === 'success') {
								this.$set(item, 'status', "SUCCESS")
								resolve(data)
							} else {
								return reject(res)
							}
						} else {
							return reject(res)
						}
					},
					fail: (res) => {
						if (item.status !== 'STOP') return reject(res)
					}
				})
				let closure = throttle()
				item.task.onProgressUpdate((res) => closure(() => {
					if (!item.totalSize) this.$set(item, 'totalSize', formatBytes(res
						.totalBytesExpectedToSend))
					if (item.status === 'STOP') item.task.abort();
					this.$set(item, 'percent', res.progress)
					this.$set(item, 'currentSize', formatBytes(res.totalBytesSent))
				}, 1000));
			})
		},
	},
	watch: {
		GET_UPLIST_LOADING(newVal, oldVal) {
			if (newVal.length) {
				if (this.uplist.filter(item => item.status === 'RUNTIME').length) return
				this.handlerUp()
			}
			uni.setStorage({
				data: this.uplist,
				key: `${this.globalData.userinfo.mobile}-uplist`
			})
		},
	}
}
