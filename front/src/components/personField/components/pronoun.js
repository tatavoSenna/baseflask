import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import DropdownField from 'components/dropdownField'

const Pronoun = ({ name, optional, fieldType, ...fieldProps }) => {
	const pageFieldsData = {
		info: '',
		type: 'dropdown',
		label: 'Pronomes',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
		options: [
			{
				label: 'Sr.',
				value: 'Sr.',
			},
			{
				label: 'Sra.',
				value: 'Sra.',
			},
			{
				label: 'Sre.',
				value: 'Sre.',
			},
		],
	}

	return <DropdownField {...fieldProps} pageFieldsData={pageFieldsData} />
}

Pronoun.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default Pronoun
