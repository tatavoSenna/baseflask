import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'
import styled from 'styled-components'

import CepField from 'components/cepField'

const AttorneyCEP = ({ key, name, optional, fieldType, ...fieldProps }) => {
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
			<Title>Endereço do procurador</Title>
			<CepField {...fieldProps} pageFieldsData={pageFieldsData} />
		</React.Fragment>
	)
}

const Title = styled.p`
	order: 17;
	flex: 1 0 100%;

	font-size: 18px;
	font-weight: 500;
	margin-bottom: 24px;
`

AttorneyCEP.propTypes = {
	key: number,
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default AttorneyCEP
