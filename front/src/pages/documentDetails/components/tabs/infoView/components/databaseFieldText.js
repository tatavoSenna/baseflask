import React, { useEffect } from 'react'
import { getDatabaseTexts } from 'states/modules/internalDatabasesField'
import { StyledLabel, StyledValue, StyledWrapperBox } from './styles/style'
import { useSelector, useDispatch } from 'react-redux'
import { object } from 'prop-types'

const DatabaseFieldText = ({ data }) => {
	const dispatch = useDispatch()
	const database = useSelector(
		({ internalDatabaseField }) => internalDatabaseField
	)

	const dataItem = database.data[data.field.databaseId]

	useEffect(() => {
		dispatch(getDatabaseTexts({ id: data.field.databaseId }))
	}, [data.field.databaseId, dispatch])

	const dataItemExist = dataItem !== undefined

	return (
		dataItemExist &&
		!dataItem.loading && (
			<>
				{data.field.label && <StyledLabel>{data.field.label}:</StyledLabel>}
				<StyledWrapperBox>
					{data.value.map((value) => (
						<StyledValue key={data.field.label + value}>
							- {dataItem.texts.find((item) => item.id === value).description}
						</StyledValue>
					))}
				</StyledWrapperBox>
			</>
		)
	)
}

DatabaseFieldText.propTypes = {
	data: object,
}

export default DatabaseFieldText
