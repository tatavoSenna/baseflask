import React from 'react'
import { StyledTitle, StyledLabel, StyledValue } from './styles/style'
import { object } from 'prop-types'

const StructureListFieldText = ({ data }) => {
	return (
		<>
			<StyledTitle>{data.label}</StyledTitle>
			{data.structure.map((d, i) => (
				<div key={i}>
					<StyledLabel>{d.label}</StyledLabel>
					<StyledValue>{d.value}</StyledValue>
				</div>
			))}
		</>
	)
}

export default StructureListFieldText

StructureListFieldText.propTypes = {
	data: object,
}
