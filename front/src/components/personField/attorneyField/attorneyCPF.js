import React from 'react'
import PropTypes, { bool, func, number, string } from 'prop-types'

import CpfField from 'components/cpfField'

import styled from 'styled-components'

const AttorneyCPF = ({
	key,
	first,
	name,
	inputValue,
	onChange,
	disabled,
	optional,
	fieldType,
	className,
}) => {
	const pageFieldsData = {
		info: '',
		type: 'cpf',
		label: 'CPF',
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
			<Title>Procurador</Title>
			<CpfField
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
	order: 11;
	flex: 1 0 100%;

	font-size: 18px;
	font-weight: 500;
	margin-bottom: 24px;
`

AttorneyCPF.propTypes = {
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

export default AttorneyCPF
