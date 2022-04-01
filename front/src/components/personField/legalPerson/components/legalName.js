import React from 'react'
import PropTypes, { bool, func, number, object, string } from 'prop-types'

import TextField from 'components/textField'
import useFieldsValue from 'components/personField/utils/useFieldsValue'

const LegalName = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	className,
	legalData,
	form,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Razão Social',
		list: name,
		variable: {
			name: 'SOCIETY_NAME',
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	useFieldsValue(
		form,
		name,
		pageFieldsData.variable.name,
		legalData?.nomeEmpresarial
	)

	return (
		<TextField
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

LegalName.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	className: string,
	legalData: object,
	form: object,
}

export default LegalName
