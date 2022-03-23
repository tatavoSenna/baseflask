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
import { FieldCard } from './fieldCard'
import { ThinDivider, ValidatedSelect } from './styles'
import { FieldConditional } from './fieldConditional'

const Field = ({
	data,
	variables,
	pageIndex,
	fieldIndex,
	type,
	icon,
	formItems,
	variableItems = true,
	showConditions = true,
	displayStyles = [],
	onValidate = () => {},
	updateFormInfo,
}) => {
	const variableNames = variables.map((x) => x?.name)

	const [validVariableName, setValidVariableName] = useState(false)
	const [validVariableStyle, setValidVariableStyle] = useState(false)

	useEffect(() => {
		if (data.variable) {
			const name = data.variable.name
			let validName =
				name && variableNames.indexOf(name) === variableNames.lastIndexOf(name)

			const style = data.variable.doc_display_style
			let validStyle =
				!style ||
				displayStyles.map((s) => s.value).includes(style) ||
				(displayStyles.length === 0 && !style.includes('|'))

			setValidVariableName(validName)
			setValidVariableStyle(validStyle)

			onValidate(validName && validStyle)
		}
	}, [data, variableNames, displayStyles, onValidate])

	const update = useUpdate({ data, pageIndex, fieldIndex, updateFormInfo })

	const updateVariable = (property, value) => {
		update({
			variable: {
				...(data?.variable ?? {}),
				[property]: value,
			},
		})
	}

	return (
		<FieldCard {...{ data, type, icon, pageIndex, fieldIndex }}>
			<div>{formItems}</div>

			{variableItems ? (
				<>
					<ThinDivider orientation="left">Variável</ThinDivider>

					<div style={{ display: 'flex' }}>
						<Input.Group compact>
							<Input
								label="Name"
								placeholder="Nome da variável"
								defaultValue={data.variable?.name || ''}
								style={{
									width: '70%',
									borderColor: validVariableName ? null : '#ff4d4f',
								}}
								onBlur={(e) => updateVariable('name', e.target.value)}
								autoComplete="chrome-off"
							/>
							<ValidatedSelect
								placeholder="Display Style"
								style={{ width: '30%' }}
								defaultValue={
									data.variable?.doc_display_style
										? data.variable?.doc_display_style.includes('|')
											? null
											: data.variable?.doc_display_style
										: 'plain'
								}
								onChange={(v) => updateVariable('doc_display_style', v)}
								$error={!validVariableStyle}
							>
								{displayStyles.map(({ value, name }, i) => (
									<Select.Option value={value} key={i}>
										{name}
									</Select.Option>
								))}
							</ValidatedSelect>
						</Input.Group>

						{React.isValidElement(variableItems) ? variableItems : null}
					</div>
				</>
			) : null}

			{showConditions ? (
				<>
					<ThinDivider orientation="left">Condicionais</ThinDivider>

					<FieldConditional
						{...{ data, variables, pageIndex, fieldIndex, updateFormInfo }}
					/>
				</>
			) : null}
		</FieldCard>
	)
}

Field.propTypes = {
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

export { Field, useUpdate }
