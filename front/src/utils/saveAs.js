/**
 * Receives a blob and a filename and downloads it on the browser.
 *
 * @param {Blob} blob
 * @param {String} filename
 */
export const saveAs = (blob, filename = 'file.docx') => {
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.setAttribute('href', url)
	link.setAttribute('download', filename)

	let clickEvent = new MouseEvent('click', {
		view: window,
		bubbles: true,
		cancelable: false,
	})

	link.dispatchEvent(clickEvent)
}

export const saveAsUrl = (url, filename = 'file.docx') => {
	const link = document.createElement('a')
	link.setAttribute('href', url)
	link.setAttribute('download', filename)

	let clickEvent = new MouseEvent('click', {
		view: window,
		bubbles: true,
		cancelable: false,
	})

	link.dispatchEvent(clickEvent)
}
