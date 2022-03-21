import React from 'react'
import PropTypes, { bool, func, number, string } from 'prop-types'

import CpfField from 'components/cpfField'

const PersonCPF = ({
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
		type: 'cpf',
		label: 'CPF',
		list: name,
		variable: {
			name: 'CPF',
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return (
		<CpfField
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

PersonCPF.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: string,
}

export default PersonCPF
