import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import CepField from 'components/cepField'

const AddressCEP = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'cep',
		label: 'CEP',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <CepField {...fieldProps} pageFieldsData={pageFieldsData} />
}

AddressCEP.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default AddressCEP
