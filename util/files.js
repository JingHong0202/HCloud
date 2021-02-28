import sort from  './sort.js'

const getRootDir = (fn) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true,
			title: "加载中..."
		})
		// 判断系统是否是安卓
		if (uni.getSystemInfoSync().platform !== "android") {
			plus.nativeUI.alert("这个组件只能在安卓下使用")
			return
		}

		// 导入原生类
		let environment = plus.android.importClass("android.os.Environment")
		// 判断sd卡是否挂载
		if (environment.getExternalStorageState() !== environment.MEDIA_MOUNTED) {
			plus.nativeUI.alert("SD卡没有挂载")
		}
		// 获取SD卡根目录
		let sdRoot = environment.getExternalStorageDirectory()
		let sdRootList = plus.android.invoke(sdRoot, "listFiles")
		// 定义自定义数据
		let sdRootPathList = []
		// 组合数据
		sdRootList.forEach(v => {
			// 判断是否可见
			if (plus.android.invoke(v, "isHidden") == true) {
				return false
			}

			let pathName = v.toString().split("/");
			if (plus.android.invoke(v, "isDirectory") === true) {
				sdRootPathList.push({
					type: 0,
					path: v,
					fileName: pathName[pathName.length - 1],

				})
			} else {
				// 获取字节数
				// plus.android.invoke(v, "length")
				sdRootPathList.push({
					type: 26,
					path: v,
					fileName: pathName[pathName.length - 1]
				})
			}
		})
		uni.hideLoading()
		resolve({
			list: [...sdRootPathList.filter(item => !item.type).sort(sort.initials), ...sdRootPathList.filter(item => item.type)
				.sort(sort.initials)
			],
			path: [{
				title: "根目录"
			}]
		})
	})
}


const getSubDir = path => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true,
			title: "加载中..."
		})
		try {
			if (plus.android.invoke(path, "isDirectory") !== true) {
				return null
			}

			let pathList = plus.android.invoke(path, "listFiles")
			// 定义自定义数据
			let subPathList = []

			// 组合数据
			pathList.forEach(v => {
				// 判断是否可见
				if (plus.android.invoke(v, "isHidden") == true) {
					return false
				}
				let pathName = v.toString().split("/")
				if (plus.android.invoke(v, "isDirectory") === true) {
					subPathList.push({
						type: 0,
						path: v,
						fileName: pathName[pathName.length - 1]
					})
				} else {
					subPathList.push({
						type: 26,
						path: v,
						fileName: pathName[pathName.length - 1]
					})
				}
			})
			uni.hideLoading()
			resolve({
				list: [...subPathList.filter(item => !item.type).sort(sort.initials), ...subPathList.filter(item => item.type).sort(
					sort.initials)],
				path
			})

		} catch (e) {
			console.log(e)
			return null
		}
	})

}


export default {
	getRootDir,
	getSubDir
}
