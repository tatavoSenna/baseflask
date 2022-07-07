import React from 'react'
import PropTypes, { bool, number, object, string } from 'prop-types'

import TextField from 'components/textField'

const AddressStreet = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Logradouro',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <TextField {...fieldProps} pageFieldsData={pageFieldsData} />
}

AddressStreet.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
	form: object,
	addressData: object,
}

export default AddressStreet
