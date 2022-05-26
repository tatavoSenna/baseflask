import React from 'react'
import PropTypes, { number, string } from 'prop-types'

import TextField from 'components/textField'

const AddressComplement = ({ name, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Complemento',
		list: name,
		optional: true,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <TextField {...fieldProps} pageFieldsData={pageFieldsData} />
}

AddressComplement.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	fieldType: string,
}

export default AddressComplement
