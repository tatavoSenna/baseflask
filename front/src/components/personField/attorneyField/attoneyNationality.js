import React from 'react'
import PropTypes, { bool, number, string } from 'prop-types'
import styled from 'styled-components'

import TextField from 'components/textField'

const AttorneyNationality = ({
	key,
	name,
	optional,
	fieldType,
	...fieldProps
}) => {
	const pageFieldsData = {
		info: '',
		type: 'text',
		label: 'Nacionalidade',
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
			<TextField {...fieldProps} pageFieldsData={pageFieldsData} />
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

AttorneyNationality.propTypes = {
	key: number,
	name: PropTypes.oneOfType([number, string]),
	optional: bool,
	fieldType: string,
}

export default AttorneyNationality
