import React from 'react'
import TextField from 'components/textField'

import PropTypes, { bool, func, number, string, object } from 'prop-types'
import useFieldsValue from '../utils/useFieldsValue'

const AddressNumber = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	className,
	form,
	legalData,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Número',
		list: name,
		variable: {
			name: 'NUMBER',
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	useFieldsValue(
		form,
		name,
		pageFieldsData.variable.name,
		legalData?.endereco?.numero
	)

	return (
		<TextField
			key={key}
			first={first}
			pageFieldsData={pageFieldsData}
			inputValue={inputValue}
			onChange={onChange}
			disabled={disabled}
			className={className}
		/>
	)
}

AddressNumber.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: string,
	legalData: object,
	form: object,
}

export default AddressNumber
