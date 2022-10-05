import Axios from 'axios'
import { useEffect, useState } from 'react'

export const useCnpjAutocomplete = (form, fields, name, setCep) => {
	const [legalField, setLegalField] = useState({})
	const [cnpj, setCnpj] = useState('')

	const item = legalField[cnpj]

	useEffect(() => {
		if (cnpj.length === 14) {
			Axios.get(
				`${process.env.REACT_APP_CNPJ_URL}/consult-cnpj?cnpj=${cnpj}`
			).then((response) => setLegalField({ [cnpj]: response.data.data }))
		}
	}, [cnpj])

	const formattedSetCnpj = (cnpj) => {
		setCnpj(cnpj.replace(/[^0-9]/g, ''))
	}

	const capitalize = (string) => {
		return string && string[0].toUpperCase() + string.slice(1).toLowerCase()
	}

	useEffect(() => {
		const setValue = (field, value) =>
			form.setFieldsValue({
				[name]: { [field.toUpperCase()]: value },
			})

		if (form && item) {
			fields.forEach((field) => {
				if (field === 'society_name') {
					setValue(field, item.nomeEmpresarial)
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
	}, [form, item, name, fields, setCep])

	return formattedSetCnpj
}
