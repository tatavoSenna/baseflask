import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'
import { getAllLegalPerson, getAllNaturalPerson } from './utils/dictsImport'

const PersonFieldText = ({ data }) => {
	const allUsableData = data.items.filter(
		(d) => d.field_type !== 'variable_name'
	)

	const naturalPerson = getAllNaturalPerson()
	const legalPerson = getAllLegalPerson()

	let dataPerson = []
	if (data.person_type === 'natural_person') {
		dataPerson = naturalPerson
	} else {
		dataPerson = legalPerson
	}

	let dataPersonUsed = []
	for (let i = 0; i < dataPerson.length; i++) {
		for (let j = 0; j < allUsableData.length; j++) {
			if (dataPerson[i]?.title) {
				dataPersonUsed.push(dataPerson[i])
				break
			}
			if (dataPerson[i].field_type === allUsableData[j].field_type) {
				dataPerson[i].value = allUsableData[j].value
				dataPersonUsed.push(dataPerson[i])
				break
			}
		}
	}

	return (
		<>
			<StyledTitle>{data.subtitle}</StyledTitle>
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
