import {
	preview,
	signatureUrl
} from '@/api/file.js'
export function selectIcon(type) {
	let path = '/static/icon/type/',
		iconFileName = [
			'folder',
			'images',
			'audio',
			'video',
			'iso',
			'txt',
			'zip',
			'web',
			'docx',
			'excel',
			'ppt',
			'pdf',
			'cad',
			'ps',
			'ai',
			'ae',
			'cloud',
			'code',
			'option',
			'markdown',
			'collection',
			'like',
			'recycle',
			'my',
			'company',
			'return',
			'other',
			'none'
		]
	return `${path}${iconFileName[type]}.png`
}
// @params Object{当前选项  当前选择所在列表}
export function open({
	current,
	list
}) {
	// 判断是否是多预览文件类型
	let file = filter(current, list)
	if (file.category && Object.prototype.toString.call(file.list) === '[object Array]') {
		return more(file, file.list.findIndex(item => item === current))
	} else {
		return single(file)
	}
}

function mimetoType(mime) {
	const types = [
		'folder',
		'image',
		'audio',
		'video',
		'iso',
		'text',
		'zip',
		'html',
		['word', 'docx'],
		['excel', 'xls'],
		['ppt', 'powerpoint'],
		'pdf',
		'cad',
		'ps',
		'ai',
		'ae',
		'cloud',
		['js', 'javascript', 'css'],
		'option',
		'collection',
		'like',
		'recycle',
		'my',
		'company',
		'return',
		'other',
		'none'
	]
	let index,
		find = types.some((item, i) => {
			if (Object.prototype.toString.call(item) === '[object Array]') {
				if (item.some(item => mime.includes(item))) {
					index = i
					return true
				}
			} else {
				if (mime.includes(item)) {
					index = i
					return true
				}
			}

			return false
		})
	// switch
	return find ? index : 26
}
export function getFileMimeType(url) {
	return new Promise((resolve, reject) => {
		plus.io.resolveLocalFileSystemURL(url, entry => {
			entry.file((f) => {
				const {
					type
				} = JSON.parse(JSON.stringify(f))
				resolve(mimetoType(type))
			})
		})
	})
}

export function randomString(len) {
	len = len || 32
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
	var maxPos = chars.length
	var pwd = ''
	for (let i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return pwd
}

export function getMedia(mode = "none") {
	return new Promise((resolve, reject) => {
		plus.gallery.pick(function(e) {
			resolve([...e.files])
		}, function(e) {
			reject("取消选择")
		}, {
			filter: mode,
			multiple: true,
			permissionAlert: true
		});
	})
}
export function getOneAnyFile() {
	return new Promise((resolve, reject) => {
		var REQUESTCODE = 1;
		var main = plus.android.runtimeMainActivity();
		var Intent = plus.android.importClass('android.content.Intent');
		var intent = new Intent(Intent.ACTION_GET_CONTENT);

		intent.setType("*/*"); //设置类型，任意类型  
		//intent.setType("image/*");  
		//intent.setType("audio/*"); //选择音频  
		//intent.setType("video/*"); //选择视频 （mp4 3gp 是android支持的视频格式）  

		intent.addCategory(Intent.CATEGORY_OPENABLE);
		main.startActivityForResult(intent, REQUESTCODE);

		main.onActivityResult = function(requestCode, resultCode, data) {
			if (REQUESTCODE == requestCode) {
				var context = main;
				plus.android.importClass(data);
				// 获得文件路径  
				var fileData = data.getData();
				var path = plus.android.invoke(fileData, "getPath");
				console.log("path:" + path);

				// 判断文件类型  
				var resolver = context.getContentResolver();
				var fileType = plus.android.invoke(resolver, "getType", fileData);
				console.log("fileType:" + fileType);
				resolve({
					path,
					fileType
				})
			}
		}
	})
}

export function formatBytes(bytes) {
	if (bytes === '0' || isNaN(bytes) || bytes === null) return '';
	var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	var e = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
}

export function getFileInfoSync(path) {
	return new Promise((resolve, reject) => {
		plus.io.getFileInfo({
			filePath: path,
			digestAlgorithm: 'md5',
			success({
				size,
				digest
			}) {
				resolve({
					size,
					digest
				})
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

function filter(file, block) {
	switch (file.type) {
		case 1:
			return filter_images(file, block)
			break;
		default:
			return file
	}
}

function filter_images(file, list) {
	let newList = list.filter(item => item.type === 1)
	return newList.length > 1 ? {
			category: 'images',
			list: newList
		} :
		file
}

function single(file) {
	let isShare = file.user_id === getApp().globalData.userinfo.mobile
	switch (file.type) {
		case 0:
			//folder
			if (isShare) {
				uni.navigateTo({
					url: '/pages/open-list/open-list?type=folder&uuid=' + file.uuid,
					animationType: 'none'
				});
			} else {
				uni.navigateTo({
					url: '/pages/open-list/open-list?type=share_folder&uuid=' + file.uuid + '&share_id=' + file
						.share_id,
					animationType: 'none'
				});
			}
			break;
		case 1:
			//images
			previewImages(file.uuid)
			break;
		case 2:
			//audio

			break;
		case 3:
			if (!isShare) {
				return uni.showToast({
					title: '请保存到自己的云盘,再播放',
					position: 'bottom'
				})
			}
			//video
			uni.navigateTo({
				url: '/pages/preview/preview',
				success() {
					// console.log(file)
					uni.$emit('preview-video', {
						data: file
					});
				}
			});
			break;
		// case 5:
		// 	uni.navigateTo({
		// 		url: "/pages/file/text"
		// 	})
		// 	break;
		case 20:
			//collection
			uni.navigateTo({
				url: '/pages/open-list/open-list?type=collection',
				complete() {
					uni.$emit('open-list', {
						data: file
					});
				}
			});
			break;
		case 25:
			uni.navigateBack({
				delta: 1
			});
			break;
		default:
			// other
			uni.showToast({
				title: '抱歉,该文件暂不支持预览',
				icon: 'none',
				position: 'bottom'
			})
	}
}

export function enum_down_list() {
	return new Promise((resolve, reject) => {
		plus.downloader.enumerate((e) => {
			resolve(e)
		})
	})
}

export function isExist(url) {
	return new Promise((resolve) => {
		plus.io.resolveLocalFileSystemURL(url, function(entry) {
			// exist
			resolve(true)
		}, function(e) {
			// no exist
			resolve(false)
		});
	})
}
export async function incr_name(dir, name) {
	let flag, incr = 1,
		reg = /(\(\d+\))/,
		prefix = name.slice(0, name.lastIndexOf('.')),
		suffix = name.slice(name.lastIndexOf('.') + 1);
	while (flag = await this.isExist(dir + name)) {
		if (!reg.test(name)) {
			name = prefix + `(${++incr}).` + suffix
		} else {
			name = name.replace(reg, `(${++incr})`)
		}
	}
	return name
}
export function moveFile(fileUrl, name) {
	return new Promise((resolve, reject) => {
		// 根据路径获取文件对象
		plus.io.resolveLocalFileSystemURL(
			fileUrl,
			fileEntry => {
				//  获取存储空间根目录
				plus.io.resolveLocalFileSystemURL('/storage/emulated/0/', async entryc => {
					// 判断是否是根目录
					let save_dir = this.down_target.split("/storage/emulated/0/")[1]
					if (!save_dir) {
						fileEntry.moveTo(entryc, await incr_name(entryc.fullPath,
								name),
							function(entry) {
								// console.log("root:New Path: " + entry.fullPath);
								resolve({
									msg: 'success',
									path: entry.fullPath
								})
							},
							function(e) {
								resolve({
									msg: e.message
								})
							});
					} else {
						let target_dir = save_dir.split('/')
						entryc.getDirectory(target_dir[target_dir.length - 1], {
							create: true
						}, async success => {
							// 最后将文件移动到创建的目录下
							fileEntry.moveTo(success, await incr_name(
								success.fullPath, name), function(
								entry) {
								resolve({
									msg: 'success',
									path: entry.fullPath
								})
							}, function(e) {
								resolve({
									msg: 'error',
									msg: e.message
								});
							});
						}, fail => {
							reject(fail)
						})
					}
				}, fail => {
					reject(fail.message)
				});
			},
			fail => {
				reject(fail)
			}
		)
	})
}

export async function beforeDown(item) {
	const {
		data
	} = (await signatureUrl(item.uuid)).data
	return {
		signUrl: data
	}
}

function more(files, currentIndex) {
	switch (files.category) {
		case 'images':
			previewImages(files.list, currentIndex)
			break;
	}
}

function previewImages(img, currentIndex = 0) {
	getApp().globalData.mode = 'previewImage'
	uni.previewImage({
		urls: img.length && Object.prototype.toString.call(img) === '[object Array]' ? img.map(item => {
			return preview(item.uuid)
		}) : [preview(img)],
		loop: true,
		current: currentIndex
	})
}
