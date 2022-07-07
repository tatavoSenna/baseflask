import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAddressInfo } from 'states/modules/addressField'
import { getStateField } from 'states/modules/stateField'

export const useCepAutocomplete = (
	form,
	fields,
	name,
	setState,
	prefix = ''
) => {
	const dispatch = useDispatch()
	const stateFields = useSelector(({ stateField }) => stateField)

	const [cep, setCep] = useState('')

	const addressInfo = useSelector(({ addressInfo }) => addressInfo.data[cep])

	const formattedSetCep = (cep) => {
		setCep(cep.replace(/[^0-9]/g, ''))
	}

	useEffect(() => {
		if (cep.length === 8) {
			dispatch(getAddressInfo(cep))
		}
	}, [cep, dispatch])

	useEffect(() => {
		dispatch(getStateField())
	}, [dispatch])

	useEffect(() => {
		if (form && addressInfo) {
			fields.forEach((field) => {
				if (field === `${prefix}street`)
					form.setFieldsValue({
						[name]: { [field.toUpperCase()]: addressInfo.logradouro },
					})
				if (field === `${prefix}state`)
					if (stateFields) {
						const newValue = stateFields.data.find(
							(item) => item.stateInitials === addressInfo.uf
						).state
						form.setFieldsValue({ [name]: { [field.toUpperCase()]: newValue } })
						setState(newValue)
					}
				if (field === `${prefix}city`)
					form.setFieldsValue({
						[name]: { [field.toUpperCase()]: addressInfo.localidade },
					})
				if (field === `${prefix}district`)
					form.setFieldsValue({
						[name]: { [field.toUpperCase()]: addressInfo.bairro },
					})
			})
		}
	}, [form, fields, addressInfo, name, stateFields, setState, prefix])

	return formattedSetCep
}
