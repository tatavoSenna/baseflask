import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import EmailField from 'components/emailField'

const Email = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'email',
		label: 'E-mail',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return <EmailField {...fieldProps} pageFieldsData={pageFieldsData} />
}

Email.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default Email
