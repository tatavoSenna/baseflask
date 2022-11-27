import { useEffect, useState, useCallback } from 'react'
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

	const info = useSelector(({ addressInfo }) => addressInfo)
	const addressInfo = info.data[cep]
	const loading = info.loading

	const formattedSetCep = useCallback(
		(cep) => {
			setCep(cep.replace(/[^0-9]/g, ''))
		},
		[setCep]
	)

	useEffect(() => {
		if (cep.length === 8) {
			dispatch(getAddressInfo(cep))
		}
	}, [cep, dispatch])

	useEffect(() => {
		dispatch(getStateField())
	}, [dispatch])

	useEffect(() => {
		const setValue = (field, value) =>
			form.setFieldsValue({
				[name]: { [field.toUpperCase()]: value },
			})

		if (form && addressInfo) {
			fields.forEach((field) => {
				if (field === `${prefix}country`) {
					setValue(field, 'Brasil')
				}
				if (field === `${prefix}street`) {
					setValue(field, addressInfo.logradouro)
				}
				if (field === `${prefix}state`)
					if (stateFields) {
						const newValue = stateFields.data.find(
							(item) => item.stateInitials === addressInfo.uf
						).state
						setValue(field, newValue)
						setState(newValue)
					}
				if (field === `${prefix}city`) {
					setValue(field, addressInfo.localidade)
				}
				if (field === `${prefix}district`) {
					setValue(field, addressInfo.bairro)
				}
			})
		}
	}, [form, fields, addressInfo, name, stateFields, setState, prefix])

	return [formattedSetCep, loading]
}
