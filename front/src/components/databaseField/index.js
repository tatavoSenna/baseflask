import React, { useEffect, useReducer, useRef, useState } from 'react'
import { string, shape, object, func, bool, number } from 'prop-types'
import Axios from 'axios'
import {
	errorMessage,
	INITIAL_STATE,
	optionsReducer,
	populateData,
} from './utils/searchReducer'
import { ACTION_TYPES } from './utils/searchActionTypes'
import SearchSelect from './searchSelect'

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

	const [dataSearch, setDataSearch] = useState('')
	const waitTimeout = useRef()

	const [state, dispatch] = useReducer(optionsReducer, INITIAL_STATE)

	useEffect(() => {
		const cancelToken = Axios.CancelToken.source()
		if (dataSearch.length >= 3) {
			dispatch({ type: ACTION_TYPES.FETCH_START })
			Axios.get(`${url}?search=${dataSearch}`, {
				cancelToken: cancelToken.token,
			})
				.then((response) => {
					const data = populateData(response, display_key, search_key)
					dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: data })
				})
				.catch((error) => {
					dispatch({ type: ACTION_TYPES.FETCH_ERROR })
					errorMessage(Axios, error)
				})
		} else {
			dispatch({ type: ACTION_TYPES.FETCH_CLEAR })
		}

		return () => {
			cancelToken.cancel()
		}
	}, [dataSearch, url, search_key, display_key])

	const handleSearch = (e) => {
		clearTimeout(waitTimeout.current)

		waitTimeout.current = setTimeout(() => {
			setDataSearch(e)
		}, 500)
	}

	return (
		<SearchSelect
			pageFieldsData={{ ...pageFieldsData, options: state.options }}
			state={state}
			onSearch={handleSearch}
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
	inputValue: number,
	disabled: bool,
	visible: bool,
}

DatabaseField.defaultProps = {
	onChange: () => null,
	visible: true,
}

export default DatabaseField
