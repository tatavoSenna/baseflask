import React, { useMemo } from 'react'
import { StyledTitle, StyledLabel, StyledValue } from './styles/style'
import { object } from 'prop-types'
import moment from 'moment'

const StructureListFieldText = ({ data }) => {
	const { field, value } = data

	const structureListInfo = useMemo(() => {
		let info = [{}]

		value.forEach((nameValue, i) => {
			field.structure.forEach((fieldStructure, j) => {
				const fieldType = fieldStructure.variable.type
				switch (fieldType) {
					case 'currency':
						const currencyValue = nameValue[fieldStructure.variable.name] || 0
						const currencyFormated = currencyValue
							.toFixed(2)
							.replace(/\./, ',')
							.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

						info[i] = {
							...info[i],
							[fieldStructure.label || j]: `R$ ${currencyFormated}`,
						}

						break
					default:
						info[i] = {
							...info[i],
							[fieldStructure.label || j]:
								nameValue[fieldStructure.variable.name],
						}
				}
			})
		})

		return info
	}, [value, field])

	return (
		<>
			<StyledTitle>{field.label}</StyledTitle>
			{structureListInfo.map((infoObject, i) => (
				<div key={i}>
					{Object.entries(infoObject).map(([key, value]) => (
						<div key={key + i}>
							<StyledLabel>{key}</StyledLabel>
							<StyledValue>
								{moment.isMoment(value) ? value._i : value}
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
