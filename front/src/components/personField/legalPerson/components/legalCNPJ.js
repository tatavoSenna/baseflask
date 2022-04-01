import React from 'react'
import PropTypes, { bool, func, number, object, string } from 'prop-types'

import CnpjField from 'components/cnpjField'

const LegalCNPJ = ({
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
		type: 'cnpj',
		label: 'CNPJ',
		list: name,
		variable: {
			name: 'CNPJ',
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return (
		<CnpjField
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

LegalCNPJ.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: string,
}

export default LegalCNPJ
