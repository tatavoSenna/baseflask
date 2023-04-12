import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'

import CityField from 'components/cityField'

const AddressCity = ({
	name,
	optional,
	fieldType,
	variableListName,
	...fieldProps
}) => {
	const pageFieldsData = {
		listName: variableListName,
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

	return <CityField {...fieldProps} pageFieldsData={pageFieldsData} />
}

AddressCity.propTypes = {
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
	variableListName: string,
}

export default AddressCity
