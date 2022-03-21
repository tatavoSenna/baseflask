import React from 'react'
import TextField from 'components/textField'

import PropTypes, { bool, func, number, string } from 'prop-types'

import styles from '../index.module.scss'

const AddressStreet = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Logradouro',
		list: name,
		variable: {
			name: 'STREET',
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return (
		<TextField
			key={key}
			first={first}
			pageFieldsData={pageFieldsData}
			inputValue={inputValue}
			onChange={onChange}
			disabled={disabled}
			className={styles['street']}
		/>
	)
}

AddressStreet.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
}

export default AddressStreet
