import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'
import { getAllLegalPerson, getAllNaturalPerson } from './utils/dictsImport'

const PersonFieldText = ({ data }) => {
	const naturalPerson = getAllNaturalPerson()
	const legalPerson = getAllLegalPerson()

	let dataPerson = ''
	let dataPersonUsed = []

	if (data.initialValue !== undefined) {
		if (data.initialValue['person_type'] === 'natural_person') {
			dataPerson = naturalPerson
		} else {
			dataPerson = legalPerson
		}

		data.fields.map((field) => {
			if (dataPerson[field] !== undefined) {
				dataPerson[field].value = data?.initialValue[field] ?? ''
				return dataPersonUsed.push(dataPerson[field])
			}
			return null
		})
	}

	return (
		<>
			{data.initialValue !== undefined ? (
				<>
					<StyledTitle>{data.label || data.variable.name}</StyledTitle>
					{dataPersonUsed.length > 0 &&
						dataPersonUsed.map((d, i) =>
							d.value === '' ? null : (
								<div key={i}>
									{d?.title && <StyledTitle>{d.title}</StyledTitle>}
									<StyledLabel>{d.label}:</StyledLabel>
									<StyledValue>{d.value}</StyledValue>
								</div>
							)
						)}
				</>
			) : null}
		</>
	)
}

export default PersonFieldText

PersonFieldText.propTypes = {
	data: PropTypes.object,
}
