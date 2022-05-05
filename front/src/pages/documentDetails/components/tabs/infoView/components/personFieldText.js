import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'
import { getAllLegalPerson, getAllNaturalPerson } from './utils/dictsImport'

const PersonFieldText = ({ data }) => {
	const naturalPerson = getAllNaturalPerson()
	const legalPerson = getAllLegalPerson()

	let dataPerson = []
	if (data.initialValue['person_type'] === 'natural_person') {
		dataPerson = naturalPerson
	} else {
		dataPerson = legalPerson
	}

	let dataPersonUsed = []
	data.fields.map((field) => {
		dataPerson[field].value = data.initialValue[field]
		return dataPersonUsed.push(dataPerson[field])
	})

	return (
		<>
			<StyledTitle>{data.label}</StyledTitle>
			{dataPersonUsed.map((d, i) => (
				<div key={i}>
					{d?.title && <StyledTitle>{d.title}</StyledTitle>}
					<StyledLabel>{d.label}</StyledLabel>
					<StyledValue>{d.value}</StyledValue>
				</div>
			))}
		</>
	)
}

export default PersonFieldText

PersonFieldText.propTypes = {
	data: PropTypes.object,
}
