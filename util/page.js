function getCurrPage() {
	try {
		let pages = getCurrentPages();
		if (pages.length) {
			return pages[pages.length - 1];
		}
	} catch (e) {}
	return undefined;
}

export function setTitleNViewButtonBadge(index, shwo, text) {
	let pages = getCurrPage();
	// #ifdef APP-PLUS
	let currentWebview = pages.$getAppWebview();
	if (shwo) {
		currentWebview.setTitleNViewButtonBadge({
			index: index,
			text: text
		})
	} else {
		currentWebview.removeTitleNViewButtonBadge({
			index: index
		})
	}
	// #endif
}
export function setTitleNViewRedDot(index, show) {
	let pages = getCurrPage();
	// #ifdef APP-PLUS 
	let currentWebview = pages.$getAppWebview();
	if (show) {
		currentWebview.showTitleNViewButtonRedDot({
			index: index
		})
	} else {
		currentWebview.hideTitleNViewButtonRedDot({
			index: index
		})
	}
	// #endif  
}


export function createSelectNav() {
	const {
		statusBarHeight,
		windowWidth
	} = uni.getSystemInfoSync()
	let nav = new plus.nativeObj.View("nav", {
		top: `${statusBarHeight}px`,
		left: '0px',
		height: `44px`,
		width: '100%',
		backgroundColor: '#e4c774',
		statusbar: {
			background: '#e4c774'
		}
	});
	nav.draw([{
			tag: 'font',
			id: 'title',
			text: '',
			textStyles: {
				size: '16px',
				color: 'white'
			},
			position: {
				bottom: '0px',
				height: '44px'
			}
		},
		{
			tag: 'font',
			id: 'cancel',
			text: '取消',
			textStyles: {
				size: '16px',
				color: 'white'
			},
			position: {
				left: '43%'
			}
		},
		{
			tag: 'font',
			id: 'all',
			text: '全选',
			textStyles: {
				size: '16px',
				color: 'white'
			},
			position: {
				right: '84%',
			}
		}
	])
	nav.addEventListener('touchstart', function(e) {
		// console.log("点击原生控件："+JSON.stringify(e));
		if (e.screenX < 45) {
			uni.$emit('select-all')
		} else if (e.screenX > (windowWidth - 45)) {
			uni.$emit('cancel-all')
		}
	})
	return nav
}
