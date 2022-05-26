import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import DropdownField from 'components/dropdownField'

const PersonMaritalState = ({
	name,
	optional,
	fieldType,
	pronoun,
	...fieldProps
}) => {
	const flexPronuon = (type, string) => {
		switch (type) {
			case 'Sra.':
				return string + 'a'
			case 'Sre.':
				return string + 'e'
			default:
				return string + 'o'
		}
	}

	const pageFieldsData = {
		info: '',
		type: 'dropdown',
		label: 'Estado Civil',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
		options: [
			{
				label: 'União estável',
				value: 'União estável',
			},
			{
				label: flexPronuon(pronoun, 'Solteir'),
				value: flexPronuon(pronoun, 'Solteir'),
			},
			{
				label: flexPronuon(pronoun, 'Casad'),
				value: flexPronuon(pronoun, 'Casad'),
			},
			{
				label: flexPronuon(pronoun, 'Divorciad'),
				value: flexPronuon(pronoun, 'Divorciad'),
			},
			{
				label: flexPronuon(pronoun, 'Viúv'),
				value: flexPronuon(pronoun, 'Viúv'),
			},
		],
	}

	return <DropdownField {...fieldProps} pageFieldsData={pageFieldsData} />
}

PersonMaritalState.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
	pronoun: string,
}

export default PersonMaritalState
