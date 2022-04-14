import React from 'react'
import TextField from 'components/textField'

import PropTypes, { bool, func, number, string } from 'prop-types'

const AddressComplement = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	fieldType,
	className,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Complemento',
		list: name,
		optional: true,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

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

AddressComplement.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	fieldType: string,
	className: string,
	disabled: bool,
}

export default AddressComplement
