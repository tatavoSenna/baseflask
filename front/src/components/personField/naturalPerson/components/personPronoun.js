import React from 'react'
import PropTypes, { bool, func, number, string } from 'prop-types'

import DropdownField from 'components/dropdownField'

const PersonPronoun = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	className,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'dropdown',
		label: 'Pronomes',
		list: name,
		variable: {
			name: 'PRONOUN',
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

PersonPronoun.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: string,
}

export default PersonPronoun
