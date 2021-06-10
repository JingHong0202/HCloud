import http from '@/util/luch-request/index.js'
import {
	formatBytes,
} from '@/util/file.js'
import {
	baseURL
} from '@/util/luch-request/server.js'

/**
 *  转存分享内容
 */
export const shareSave = (data) => {
	return http.middleware({
		method: 'PUT', // 必须大写
		url: '/shareSave',
		custom: {
			auth: true,
			loading: {
				title: '保存中...'
			}
		},
		data
	})
}


/**
 *  获取分享内容
 */
export const getContent = (id, code) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/share/' + id,
		custom: {
			auth: true
		},
		params: {
			code
		}
	})
}

/**
 *  获取分享子文件内容
 */
export const getChildContent = (id, shareUrl) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/getShareList',
		custom: {
			auth: true
		},
		params: {
			uuid: id,
			share: shareUrl
		}
	})
}

/**
 *  获取分享link
 */

export const formatLink = id => {
	return `${baseURL}/share/${id}`
}


/**
 *  创建分享
 */

export const create = data => {
	return http.middleware({
		method: 'POST', // 必须大写
		url: '/share',
		custom: {
			auth: true,
			loading: {
				title: '创建中...'
			}
		},
		data
	})
}


/**
 *  获取分享列表
 */

export const getlist = () => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/share',
		custom: {
			auth: true
		}
	})
}


/**
 *  取消分享
 */

export const cancel = data => {
	return http.middleware({
		method: 'DELETE', // 必须大写
		url: '/share/del',
		custom: {
			auth: true,
			loading: {
				title: '提交中...'
			}
		},
		data
	})
}

/**
 *  设置提取码
 */

export const setCode = (id, code) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/share/' + id + '/edit',
		custom: {
			auth: true,
			loading: {
				title: '修改中...'
			}
		},
		params: {
			code
		}
	})
}
