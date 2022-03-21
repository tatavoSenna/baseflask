import React from 'react'
import PropTypes, { bool, func, number, object, string } from 'prop-types'

import TextField from 'components/textField'

const LegalName = ({
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
		label: 'Razão Social',
		list: name,
		variable: {
			name: 'SOCIETY_NAME',
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

LegalName.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: PropTypes.oneOfType([object, string]),
}

export default LegalName
