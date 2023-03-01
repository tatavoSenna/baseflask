import React from 'react'
import { StyledTitle, StyledLabel, StyledValue } from './styles/style'
import { object } from 'prop-types'
import moment from 'moment'

const StructureListFieldText = ({ data }) => {
	const { field, value } = data

	return (
		<>
			<StyledTitle>{field.label}</StyledTitle>
			{value.map((item, i) => (
				<div key={i}>
					{field.structure.map((data, j) => (
						<div key={i + j}>
							<StyledLabel>{data.label}</StyledLabel>
							<StyledValue>
								{moment.isMoment(item[data.variable.name])
									? item[data.variable.name]._i
									: item[data.variable.name]}
							</StyledValue>
						</div>
					))}
				</div>
			))}
		</>
	)
}

export default StructureListFieldText

StructureListFieldText.propTypes = {
	data: object,
}
