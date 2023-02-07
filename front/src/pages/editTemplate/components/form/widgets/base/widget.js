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
import { Input, Select } from 'antd'

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
	onUpdate,
	compact = false,
	onRemove,
}) => {
	const variableNames = variables.map((x) => x?.name || x?.main?.name)

	const [validVariableName, setValidVariableName] = useState(false)
	const [validConditionals, setValidConditionals] = useState(true)

	useEffect(() => {
		if (data.variable) {
			const name = data.variable.name
			let validName =
				name !== '' &&
				variableNames.indexOf(name) === variableNames.lastIndexOf(name)

			setValidVariableName(validName)
		}
	}, [data, variableNames, displayStyles])

	useEffect(() => {
		onValidate(validVariableName && validConditionals)
	}, [validVariableName, validConditionals, onValidate])

	const update = useUpdate({ data, pageIndex, fieldIndex, onUpdate })

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

	const widgetInfo = (
		<>
			<div>{formItems}</div>

			{variableItems ? (
				<>
					{!compact ? (
						<ThinDivider orientation="left">Variável</ThinDivider>
					) : (
						<p style={{ padding: 4, marginBottom: 6 }}>Variavel:</p>
					)}

					<div style={{ display: 'flex', marginBottom: '24px' }}>
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
												? displayStyles[0].value
												: data.variable?.doc_display_style
											: null
									}
									onChange={(v) => updateVariable('doc_display_style', v)}>
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
		</>
	)

	return (
		<WidgetCard
			{...{ data, type, icon, pageIndex, fieldIndex, onRemove, compact }}>
			{widgetInfo}
			{!compact && showConditions ? (
				<>
					<ThinDivider orientation="left">Condicionais</ThinDivider>

					<WidgetConditional
						{...{
							data,
							variables,
							pageIndex,
							fieldIndex,
							onValidate: setValidConditionals,
							onUpdate,
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
	onUpdate: func,
	onValidate: func,
	compact: bool,
	onRemove: func,
}

function useValidation({ valid, pageIndex, fieldIndex, onValidate }) {
	const setValid = (v) => {
		if (v !== valid) {
			onValidate(v, pageIndex, fieldIndex)
		}
	}

	return [valid, setValid]
}

function useUpdate({ data, pageIndex, fieldIndex, onUpdate }) {
	const update = useCallback(
		(diff) => {
			if (!subObjectComparison(data, diff)) {
				onUpdate({ ...data, ...diff }, pageIndex, fieldIndex)
			}
		},
		[data, pageIndex, fieldIndex, onUpdate]
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
