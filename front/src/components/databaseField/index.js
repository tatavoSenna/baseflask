import React, { useEffect, useMemo } from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { apiRequest } from '~/states/modules/databaseField'
import { useDispatch, useSelector } from 'react-redux'
import DropdownField from 'components/dropdownField'

const DatabaseField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	form,
	disabled,
	visible,
}) => {
	const { variable } = pageFieldsData
	const url = variable?.database_endpoint
	const search_key = variable?.search_key
	const display_key = variable?.display_key

	const dispatch = useDispatch()
	const [data, error] = useSelector(({ databaseField }) => [
		databaseField.data[url],
		databaseField.error[url],
	])

	useEffect(() => {
		if (url && !data) dispatch(apiRequest({ url }))
	}, [url, data, dispatch])

	const options = useMemo(
		() =>
			(data ?? []).map((d) => ({
				label: String(d[display_key]),
				value: d[search_key],
			})),
		[data, display_key, search_key]
	)

	return (
		<DropdownField
			notFoundContent={error ? 'Falha ao requisitar API externa' : undefined}
			pageFieldsData={{ ...pageFieldsData, options }}
			{...{ className, onChange, inputValue, disabled, visible, form }}
		/>
	)
}

DatabaseField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	form: object,
	className: string,
	onChange: func,
	inputValue: string,
	disabled: bool,
	visible: bool,
}

DatabaseField.defaultProps = {
	onChange: () => null,
	visible: true,
}

export default DatabaseField
