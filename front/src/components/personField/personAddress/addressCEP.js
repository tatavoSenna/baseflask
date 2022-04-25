import React from 'react'
import PropTypes, { bool, func, number, string } from 'prop-types'
import styled from 'styled-components'
import CepField from 'components/cepField'

const AddressCEP = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	optional,
	className,
	fieldType,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'cep',
		label: 'CEP',
		list: name,
		optional: optional,
		variable: {
			name: fieldType.toUpperCase(),
			type: 'string',
			doc_display_style: 'plain',
		},
	}

	return (
		<React.Fragment key={key}>
			<Title>Endereço</Title>
			<CepField
				key={key}
				first={first}
				pageFieldsData={pageFieldsData}
				inputValue={inputValue}
				onChange={onChange}
				disabled={disabled}
				className={className}
			/>
		</React.Fragment>
	)
}

const Title = styled.p`
	order: 6;
	flex: 1 0 100%;

	font-size: 18px;
	font-weight: 500;
	margin-bottom: 24px;
`

AddressCEP.propTypes = {
	key: number,
	first: bool,
	name: PropTypes.oneOfType([number, string]),
	inputValue: string,
	onChange: func,
	disabled: bool,
	optional: bool,
	fieldType: string,
	className: string,
}

export default AddressCEP
