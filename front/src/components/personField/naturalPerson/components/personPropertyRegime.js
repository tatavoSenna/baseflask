import React, { useEffect, useState } from 'react'
import PropTypes, { bool, func, number, object, string } from 'prop-types'

import DropdownField from 'components/dropdownField'

const PersonPropertyRegime = ({
	name,
	inputValue,
	disabled,
	fieldType,
	onChange,
	maritalState,
	form,
	...fieldProps
}) => {
	const [thisValue, setThisValue] = useState('')

	let value = ''
	let _disabled = disabled
	if (
		maritalState !== undefined &&
		(maritalState === 'União estável' || maritalState.includes('Casad'))
	) {
		value = thisValue === '' ? inputValue : thisValue
		if (!disabled) _disabled = false
	} else {
		value = ''
		_disabled = true
	}

	const handleOnChange = (value) => {
		setThisValue(value)
		onChange(value)
	}

	const pageFieldsData = {
		info: '',
		type: 'dropdown',
		label: 'Regime de bens',
		optional: true,
		list: name,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
		options: [
			{
				label: 'Comunhão parcial',
				value: 'Comunhão parcial',
			},
			{
				label: 'Comunhão universal',
				value: 'Comunhão universal',
			},
			{
				label: 'Separação de bens',
				value: 'Separação de bens',
			},
			{
				label: 'Participação final nos aquestos',
				value: 'Participação final nos aquestos',
			},
		],
	}

	useEffect(() => {
		if (form !== undefined && _disabled) {
			form.setFieldsValue({
				[name]: {
					[fieldType.toUpperCase()]: value,
				},
			})
		}
	}, [form, _disabled, name, fieldType, value])

	return (
		<DropdownField
			{...fieldProps}
			inputValue={inputValue}
			pageFieldsData={pageFieldsData}
			onChange={handleOnChange}
			disabled={_disabled}
		/>
	)
}

PersonPropertyRegime.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	disabled: bool,
	fieldType: string,
	onChange: func,
	maritalState: string,
	form: object,
}

export default PersonPropertyRegime
