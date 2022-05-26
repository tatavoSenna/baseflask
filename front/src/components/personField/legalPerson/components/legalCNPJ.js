import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import CnpjField from 'components/cnpjField'

const LegalCNPJ = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'cnpj',
		label: 'CNPJ',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <CnpjField {...fieldProps} pageFieldsData={pageFieldsData} />
}

LegalCNPJ.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default LegalCNPJ
