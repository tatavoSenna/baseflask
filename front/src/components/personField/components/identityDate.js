import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import DateField from 'components/dateField'

const IdentityDate = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Data de exp',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <DateField {...fieldProps} pageFieldsData={pageFieldsData} />
}

IdentityDate.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default IdentityDate
