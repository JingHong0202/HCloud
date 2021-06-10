export default {
	initials(a, b) {
		return a.fileName.charAt(0).toLocaleLowerCase().localeCompare(b.fileName.charAt(0).toLocaleLowerCase())
	},
	filesize(a, b) {
		return a.file_size - b.file_size
	},
	time(a, b) {
		return Date.parse(a.date) - Date.parse(b.date)
	},
	initials_reverse(a, b) {
		return b.fileName.charAt(0).toLocaleLowerCase().localeCompare(a.fileName.charAt(0).toLocaleLowerCase())
	},
	filesize_reverse(a, b) {
		return b.file_size - a.file_size
	},
	time_reverse(a, b) {
		return Date.parse(b.date) - Date.parse(a.date)
	}
}
