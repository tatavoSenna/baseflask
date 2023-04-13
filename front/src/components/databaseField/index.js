import React, { useEffect, useReducer, useRef, useState } from 'react'
import PropTypes, {
	string,
	shape,
	object,
	func,
	bool,
	number,
} from 'prop-types'
import Axios from 'axios'
import {
	errorMessage,
	INITIAL_STATE,
	optionsReducer,
	populateData,
} from './utils/searchReducer'
import { ACTION_TYPES } from './utils/searchActionTypes'
import SearchSelect from './searchSelect'
import { Form, Input } from 'antd'

const DatabaseField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	form,
	disabled,
	visible,
}) => {
	const { variable, id } = pageFieldsData

	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const url = variable?.database_endpoint
	const search_key = variable?.search_key
	const display_key = variable?.display_key

	const [dataSearch, setDataSearch] = useState('')
	const [labelValue, setLabelValue] = useState(
		typeof inputValue === 'object' ? inputValue.exibicao : ''
	)
	const waitTimeout = useRef()
	const loadedOneTime = useRef(false)

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

	// make an array of one option to input with informations from inputValue
	useEffect(() => {
		if (
			inputValue !== '' &&
			!loadedOneTime.current &&
			typeof inputValue === 'object'
		) {
			loadedOneTime.current = true
			dispatch({
				type: ACTION_TYPES.FETCH_SUCCESS,
				payload: [{ label: inputValue.exibicao, value: inputValue.indice }],
			})
		}
	}, [inputValue])

	useEffect(() => {
		if (form) {
			form.setFieldsValue({
				[name]: { ...form.getFieldsValue()[name], EXIBICAO: labelValue },
			})
		}
	}, [form, name, labelValue])

	const handleChange = (e) => {
		let label = state.options[0].label
		if (state.options.length > 1) {
			label = state.options.find((option) => option.value === e).label
		}
		setLabelValue(label)
		onChange(e)
	}

	return (
		<>
			<Form.Item
				style={{ display: 'none' }}
				name={[name, 'EXIBICAO']}
				initialValue={
					typeof inputValue === 'object' ? inputValue.exibicao : ''
				}>
				<Input />
			</Form.Item>
			<SearchSelect
				pageFieldsData={{
					...pageFieldsData,
					options: state.options,
					list: name,
				}}
				state={state}
				onSearch={handleSearch}
				onChange={handleChange}
				{...{ className, inputValue, disabled, visible, form }}
			/>
		</>
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
	inputValue: PropTypes.oneOfType([number, string, object]),
	disabled: bool,
	visible: bool,
}

DatabaseField.defaultProps = {
	onChange: () => null,
	visible: true,
}

export default DatabaseField
