import React from 'react'
import PropTypes, { bool, func, number, object, string } from 'prop-types'

import DropdownField from 'components/dropdownField'

const PersonMaritalState = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	optional,
	fieldType,
	className,
	pronoun,
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

	return (
		<DropdownField
			key={key}
			first={first}
			pageFieldsData={pageFieldsData}
			inputValue={inputValue}
			onChange={onChange}
			disabled={disabled}
			className={className}
		/>
	)
}

PersonMaritalState.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	optional: bool,
	fieldType: string,
	className: string,
	pronoun: string,
	form: object,
}

export default PersonMaritalState
