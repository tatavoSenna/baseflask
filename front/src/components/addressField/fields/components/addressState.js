import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import StateField from 'components/stateField'

const AddressState = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'state',
		label: 'Estado',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <StateField {...fieldProps} pageFieldsData={pageFieldsData} />
}

AddressState.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default AddressState
