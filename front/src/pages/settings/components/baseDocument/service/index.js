import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { useState } from 'react'
import api from 'services/api'
import { getCompanyInfo } from 'states/modules/companies'

const BaseDocumentService = () => {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const { companyInfo, loading: loadingName } = useSelector(
		({ companies }) => companies
	)
	const { baseDocument } = companyInfo

	const uploadFile = (file) => {
		setLoading(true)
		setError(false)

		const form = new FormData()
		form.append('file', file, file.name)
		api
			.post('/company/basedocument/upload', form)
			.then((response) => {
				message.success(response.data.message)
			})
			.catch((error) => {
				setError(true)
				message.error('Não foi possível subir o arquivo para o servidor')
			})
			.finally(() => {
				setLoading(false)
			})
	}

	// get name of the base document
	useEffect(() => {
		dispatch(getCompanyInfo())
	}, [dispatch])

	return { loading, loadingName, error, baseDocument, uploadFile }
}

export default BaseDocumentService
