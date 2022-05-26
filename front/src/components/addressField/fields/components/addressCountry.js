import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import TextField from 'components/textField'

const AddressCountry = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'País',
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

AddressCountry.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default AddressCountry
