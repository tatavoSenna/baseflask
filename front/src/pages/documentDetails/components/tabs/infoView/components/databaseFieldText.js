import React, { useEffect } from 'react'
import { getDatabaseTexts } from 'states/modules/internalDatabasesField'
import { StyledLabel, StyledValue, StyledWrapperBox } from './styles/style'
import { useSelector, useDispatch } from 'react-redux'
import { object } from 'prop-types'

const DatabaseFieldText = ({ data }) => {
	const { databaseId, label, initialValue, variable } = data
	const dispatch = useDispatch()
	const database = useSelector(
		({ internalDatabaseField }) => internalDatabaseField
	)

	const dataItem = database.data[databaseId]

	useEffect(() => {
		dispatch(getDatabaseTexts({ id: databaseId }))
	}, [databaseId, dispatch])

	const dataItemExist = dataItem !== undefined

	return (
		dataItemExist &&
		!dataItem.loading && (
			<>
				<StyledLabel>{label || variable.name}:</StyledLabel>
				<StyledWrapperBox>
					{initialValue.map((value) => (
						<StyledValue key={label + value}>
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
