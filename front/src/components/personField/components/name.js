import React from 'react'
import PropTypes, { bool, func, number, string } from 'prop-types'

import TextField from 'components/textField'

const Name = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	optional,
	fieldType,
	className,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Nome',
		list: name,
		optional: optional,
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

Name.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	optional: bool,
	fieldType: string,
	className: string,
}

export default Name