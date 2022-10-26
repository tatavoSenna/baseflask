import api from './api'
import axios from 'axios'
import { saveAs } from 'utils/saveAs'
import slugify from 'slugify'

class DocumentDetailsService {
	async downloadTextDocumentVersion({
		id,
		versionId,
		versionName,
		documentTitle,
	}) {
		const slug = slugify(documentTitle + ' ' + versionName)
		const documentName = slug + '.docx'

		return api
			.get(`/documents/${id}/text?version=${versionId}`)
			.then((response) => response.data)
			.then(async (data) => {
				const url = process.env.REACT_APP_HTML_DOCX_URL
				const headers = {
					'Content-Type': 'application/json',
					Accept:
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				}
				const payload = JSON.stringify({ text: data.text })
				const res = await axios.post(url, payload, {
					headers,
					responseType: 'blob',
				})

				saveAs(res.data, documentName || 'document.docx')

				return {
					id: data.version_id,
					comments: data.comments,
					text: data.text,
				}
			})
			.catch((error) => {
				console.log(
					'An error occurred in the DocumentDetailsService',
					error.response.data.error
				)
				throw error.response.data.error
			})
	}
}

export default new DocumentDetailsService()
