export default {
	initials(a, b) {
		return a.fileName.charAt(0).toLocaleLowerCase().localeCompare(b.fileName.charAt(0).toLocaleLowerCase())
	},
	filesize(a, b) {
		return a.fileSize - b.fileSize
	},
	time(a, b) {
		return Date.parse(a.date) - Date.parse(b.date)
	}
}
