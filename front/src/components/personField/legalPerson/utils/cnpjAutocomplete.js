import { message } from 'antd'
import Axios from 'axios'
import { useEffect, useState } from 'react'

export const useCnpjAutocomplete = (
	form,
	fields,
	name,
	setCep,
	personList,
	variableListName,
	listLabelChange
) => {
	const [legalField, setLegalField] = useState({})
	const [cnpj, setCnpj] = useState('')
	const [loading, setLoading] = useState(false)

	const item = legalField[cnpj]

	useEffect(() => {
		const cancelToken = Axios.CancelToken.source()
		if (cnpj.length === 14) {
			setLoading(true)
			Axios.get(`${process.env.REACT_APP_CNPJ_URL}/consult-cnpj?cnpj=${cnpj}`, {
				cancelToken: cancelToken.token,
			})
				.then((response) => {
					setLegalField({ [cnpj]: response.data.data })
				})
				.catch((error) => {
					message.error('Dados do CNPJ indisponíveis!')
				})
				.finally(() => {
					setLoading(false)
				})
		}

		return () => {
			cancelToken.cancel()
		}
	}, [cnpj])

	const formattedSetCnpj = (cnpj) => {
		setCnpj(cnpj.replace(/[^0-9]/g, ''))
	}

	const capitalize = (string) => {
		return string && string[0].toUpperCase() + string.slice(1).toLowerCase()
	}

	useEffect(() => {
		const setValue = (field, value) => {
			if (personList) {
				const fields = form.getFieldsValue()[variableListName]

				const update = { ...fields[name], [field.toUpperCase()]: value }
				fields[name] = update

				return form.setFieldsValue({
					[variableListName]: fields,
				})
			}
			return form.setFieldsValue({
				[name]: { [field.toUpperCase()]: value },
			})
		}

		if (form && item) {
			fields.forEach((field) => {
				if (field === 'society_name') {
					setValue(field, item.nomeEmpresarial)
					listLabelChange(item.nomeEmpresarial, name)
				}
				if (field === 'activity') {
					setValue(field, item.cnaePrincipal.descricao)
				}
				if (field === 'cep') {
					setValue(field, item.endereco.cep)
					setCep(item.endereco.cep)
				}
				if (field === 'country') {
					setValue(field, capitalize(item.endereco.pais.descricao))
				}
				if (field === 'number') {
					setValue(field, item.endereco.numero)
				}
				if (field === 'complement') {
					setValue(field, item.endereco.complemento)
				}
			})
		}
	}, [
		form,
		item,
		name,
		fields,
		setCep,
		personList,
		variableListName,
		listLabelChange,
	])

	return [formattedSetCnpj, loading]
}
