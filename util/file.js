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
				console.log(data)
				// 获得文件路径  
				var fileData = data.getData();
				var path = plus.android.invoke(fileData, "getPath");
				// console.log("path:" + path);

				// 判断文件类型  
				var resolver = context.getContentResolver();
				var fileType = plus.android.invoke(resolver, "getType", fileData);
				// console.log("fileType:" + fileType);
				resolve({
					path,
					fileType
				})
			}
		}
	})
}

export function formatBytes(bytes) {
	if (bytes === '0' || isNaN(bytes)) return '';
	var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	var e = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, Math.floor(e))).toFixed(1) + " " + s[e];
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
	switch (file.type) {
		case 0:
			//folder
			// 根据uuid请求对应列表
			return {
				list: [{
					fileName: 'uni-app教学视频',
					type: 0,
					date: '2020-12-04'
				}, {
					fileName: 'uni-app教学视频',
					type: 0,
					date: '2020-12-04'
				}, {
					fileName: 'uni-app教学视频',
					type: 0,
					date: '2020-12-04'
				}],
				parentId: 1002,
				path: [{
						title: "全部文件",
						uuid: 1
					},
					{
						title: "uni-app教学视频",
						uuid: 2
					}
				]
			}
			break;
		case 1:
			//images
			previewImages(file.url)
			break;
		case 2:
			//audio

			break;
		case 3:
			//video
			uni.navigateTo({
				url: '/pages/preview/preview',
				success() {
					uni.$emit('preview-video', {
						data: file
					});
				}
			});
			break;
		case 20:
			//collection
			uni.navigateTo({
				url: '/pages/dynamic-list/dynamic-list',
				success() {
					uni.$emit('open-dynamicList', {
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
		urls: img.length && Object.prototype.toString.call(img) === '[object Array]' ? img.map(item => item.url) : [img],
		loop: true,
		current: currentIndex
	})

}
