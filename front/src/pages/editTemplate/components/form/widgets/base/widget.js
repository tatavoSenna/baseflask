import React, { useCallback, useEffect, useState } from 'react'
import {
	object,
	func,
	number,
	array,
	string,
	node,
	bool,
	oneOfType,
} from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Select } from 'antd'

import { editTemplateFieldValid } from '~/states/modules/editTemplate'
import { WidgetCard } from './widgetCard'
import { WidgetConditional } from './widgetConditional'
import { ThinDivider, ValidatedSelect, ValidatedInput } from './styles'

const Widget = ({
	data,
	variables,
	pageIndex,
	fieldIndex,
	type,
	icon,
	formItems,
	variableItems = true,
	showConditions = true,
	displayStyles,
	onValidate = () => {},
	updateFormInfo,
}) => {
	const variableNames = variables.map((x) => x?.name)

	const [validVariableName, setValidVariableName] = useState(false)
	const [validVariableStyle, setValidVariableStyle] = useState(false)
	const [validConditionals, setValidConditionals] = useState(true)

	useEffect(() => {
		if (data.variable) {
			const name = data.variable.name
			let validName =
				name !== '' &&
				variableNames.indexOf(name) === variableNames.lastIndexOf(name)

			const style = data.variable.doc_display_style
			let validStyle =
				!displayStyles ||
				!('doc_display_style' in data.variable) ||
				displayStyles.map((s) => s.value).includes(style) ||
				(displayStyles.length === 0 && style.length > 0 && !style.includes('|'))

			setValidVariableName(validName)
			setValidVariableStyle(validStyle)
		}
	}, [data, variableNames, displayStyles])

	useEffect(() => {
		onValidate(validVariableName && validVariableStyle && validConditionals)
	}, [validVariableName, validVariableStyle, validConditionals, onValidate])

	const update = useUpdate({ data, pageIndex, fieldIndex, updateFormInfo })

	const updateVariable = useCallback(
		(property, value) => {
			update({
				variable: {
					...(data?.variable ?? {}),
					[property]: value,
				},
			})
		},
		[data, update]
	)

	return (
		<WidgetCard {...{ data, type, icon, pageIndex, fieldIndex }}>
			<div>{formItems}</div>

			{variableItems ? (
				<>
					<ThinDivider orientation="left">Variável</ThinDivider>

					<div style={{ display: 'flex' }}>
						<Input.Group compact>
							<ValidatedInput
								label="Name"
								placeholder="Nome da variável"
								defaultValue={data.variable?.name || ''}
								style={{ width: displayStyles ? '70%' : '100%' }}
								onBlur={(e) => updateVariable('name', e.target.value)}
								$error={!validVariableName}
								autoComplete="chrome-off"
							/>
							{displayStyles ? (
								<ValidatedSelect
									placeholder="Display Style"
									style={{ width: '30%' }}
									defaultValue={
										data.variable?.doc_display_style
											? data.variable?.doc_display_style.includes('|')
												? null
												: data.variable?.doc_display_style
											: null
									}
									onChange={(v) => updateVariable('doc_display_style', v)}
									$error={!validVariableStyle}>
									{displayStyles.map(({ value, name }, i) => (
										<Select.Option value={value} key={i}>
											{name}
										</Select.Option>
									))}
								</ValidatedSelect>
							) : null}
						</Input.Group>

						{React.isValidElement(variableItems) ? variableItems : null}
					</div>
				</>
			) : null}

			{showConditions ? (
				<>
					<ThinDivider orientation="left">Condicionais</ThinDivider>

					<WidgetConditional
						{...{
							data,
							variables,
							pageIndex,
							fieldIndex,
							onValidate: setValidConditionals,
							updateFormInfo,
						}}
					/>
				</>
			) : null}
		</WidgetCard>
	)
}

Widget.propTypes = {
	data: object,
	variables: array,
	pageIndex: number,
	fieldIndex: number,
	type: string,
	icon: node,
	formItems: node,
	variableItems: oneOfType([node, bool]),
	showConditions: bool,
	displayStyles: array,
	updateFormInfo: func,
	onValidate: func,
}

function useValidation({ pageIndex, fieldIndex }) {
	const dispatch = useDispatch()
	const valid = useSelector(
		({ editTemplate }) => editTemplate.data.form[pageIndex].valid[fieldIndex]
	)

	const setValid = (v) => {
		if (v !== valid) {
			dispatch(editTemplateFieldValid({ value: v, pageIndex, fieldIndex }))
		}
	}

	return [valid, setValid]
}

function useUpdate({ data, pageIndex, fieldIndex, updateFormInfo }) {
	const update = useCallback(
		(diff) => {
			if (!subObjectComparison(data, diff)) {
				updateFormInfo({ ...data, ...diff }, 'field', pageIndex, fieldIndex)
			}
		},
		[data, pageIndex, fieldIndex, updateFormInfo]
	)

	return update
}

// Does a deep check if 'b' is a sub object of 'a'
// Only valid for simple JSON-like objects
const subObjectComparison = (a, b) => {
	if (typeof a !== typeof b) return false

	if (Array.isArray(b))
		return (
			a.length === b.length && b.every((v, i) => subObjectComparison(a[i], v))
		)
	if (typeof b === 'object')
		return Object.entries(b).reduce(
			(acc, [key, value]) => acc && subObjectComparison(a[key], value),
			true
		)
	else return a === b
}

export { Widget, useValidation, useUpdate }
