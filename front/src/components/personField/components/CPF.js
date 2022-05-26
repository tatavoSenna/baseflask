import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import CpfField from 'components/cpfField'

const CPF = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'cpf',
		label: 'CPF',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <CpfField {...fieldProps} pageFieldsData={pageFieldsData} />
}

CPF.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default CPF
