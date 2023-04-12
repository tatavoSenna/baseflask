import React, { useEffect } from 'react'
import { array, number } from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'
import { updateVisible } from '~/states/modules/question'

import styles from './index.module.scss'
import './styles.css'
import { inputTypes } from './utils/dictImports'
import { Divider } from 'antd'

function InputFactory({
	data: pageFieldsData,
	visible,
	disabled,
	initialValues,
	form,
	currentFormStep,
}) {
	const dispatch = useDispatch()

	// Call updateVisible after first render, so the default values are considered for visibility

	useEffect(() => {
		if (typeof form !== 'undefined') {
			dispatch(
				updateVisible({
					form,
				})
			)
		}
	}, [dispatch, form, currentFormStep])

	const conditionals = useSelector(({ question }) => question.conditionals)

	const componentsInputs = []

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, initialValue, variable } = pageFieldsData[i]
		const isVisible = visible[i] ? styles['default-style'] : styles.hidden
		const key = currentFormStep + '_' + i

		let isConditional, subConditions
		if (variable?.name !== undefined) {
			const conditions = conditionals
				.map((c) => c.split('.'))
				.filter((c) => c[0] === variable.name)

			isConditional = conditions.length > 0
			subConditions = new Set(conditions.map((c) => c[1]).filter((c) => c))
		}

		const defaultValue = () => {
			if (initialValues) {
				if (variable) {
					if (variable.hasOwnProperty('name')) {
						return initialValues[variable.name]
							? initialValues[variable.name]
							: initialValue
					} else {
						return initialValues[variable]
							? initialValues[variable]
							: initialValue
					}
				}
			}
			return initialValue
		}
		const first = i === 0

		let onchange = (selector = (e) => e) =>
			isConditional
				? (e, subfield) => {
						if (subfield === undefined || subConditions.has(subfield))
							dispatch(
								updateVisible({
									input: selector(e),
									form,
									fieldIndex: i,
									pageIndex: currentFormStep,
									subfield,
								})
							)
				  }
				: () => {}

		const commonProps = {
			key: key,
			pageIndex: currentFormStep,
			pageFieldsData: pageFieldsData[i],
			className: isVisible,
			disabled: disabled,
			visible: visible[i],
			inputValue: defaultValue(),
			fieldIndex: i,
			form: form,
			onChange: onchange(),
			first: first,
		}

		if (type === 'radio' || type === 'time' || type === 'structured_checkbox') {
			commonProps.onChange = onchange((e) => e.target.value)
		}

		if (type === 'separator') {
			componentsInputs.push(
				<Divider
					key={key}
					className={isVisible}
					style={{ alignSelf: 'center' }}>
					{pageFieldsData[i].title}
				</Divider>
			)
		} else if (inputTypes[type] !== undefined) {
			componentsInputs.push(React.createElement(inputTypes[type], commonProps))
		} else {
			componentsInputs.push(
				React.createElement(inputTypes['default'], commonProps)
			)
		}
	}
	return componentsInputs
}

InputFactory.propTypes = {
	data: array.isRequired,
	visible: array,
	currentFormStep: number,
}

export default InputFactory
