import React from 'react'

import PropTypes, { bool, func, number, object, string } from 'prop-types'
import CityField from 'components/cityField'

const AddressCity = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	optional,
	fieldType,
	className,
	state,
	form,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'city',
		label: 'Cidade',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return (
		<CityField
			key={key}
			first={first}
			pageFieldsData={pageFieldsData}
			inputValue={inputValue}
			onChange={onChange}
			disabled={disabled}
			className={className}
			state={state}
			form={form}
		/>
	)
}

AddressCity.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	fieldType: string,
	className: string,
	form: object,
	disabled: bool,
	optional: bool,
	state: string,
}

export default AddressCity
