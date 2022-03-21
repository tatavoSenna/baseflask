import React from 'react'
import TextField from 'components/textField'

import PropTypes, { bool, func, number, string } from 'prop-types'

const AddressState = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	className,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Estado',
		list: name,
		variable: {
			name: 'STATE',
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

AddressState.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: string,
}

export default AddressState
