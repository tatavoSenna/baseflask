import React, { useEffect, useMemo, useState } from 'react'
import { object, func, number, array } from 'prop-types'
import { Form, Input, Select, Button } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useUpdate } from './widget'
import { ListItem, ValidatedSelect } from './styles'
import { TextInput } from '../textWidget'
import { NumberInput } from '../numberWidget'
import { CurrencyInput } from '../currencyWidget'

const conditionalInputs = {
	string: TextInput,
	number: NumberInput,
	currency: CurrencyInput,
}

const WidgetConditional = ({
	data,
	variables,
	pageIndex,
	fieldIndex,
	onValidate,
	updateFormInfo,
}) => {
	const variableNames = useMemo(() => {
		let allVariables = []

		for (let v of variables) {
			if (v !== undefined) {
				if (Object.keys(conditionalInputs).includes(v.type))
					allVariables.push(v.name)
				else if (Array.isArray(v.fields) && v.name)
					allVariables.push(...v.fields.map((f) => v.name + '.' + f))
			}
		}

		return allVariables
	}, [variables])

	const variableOptions = useMemo(
		() =>
			variableNames
				.filter((x, i, arr) => arr.indexOf(x) === i) // Checks unique
				.filter((x) => x && x !== data?.variable?.name)
				.map((x) => ({ value: x })),
		[variableNames, data]
	)

	const conditions = useMemo(
		() =>
			'condition' in data
				? Array.isArray(data.condition)
					? data.condition
					: [data.condition]
				: [],
		[data]
	)

	const [validConditionVars, setValidVars] = useState([])
	useEffect(() => {
		const validVars = conditions.map((c) => variableNames.includes(c.variable))
		setValidVars(validVars)

		onValidate(validVars.every((c) => c))
	}, [conditions, variableNames, onValidate])

	const update = useUpdate({ data, pageIndex, fieldIndex, updateFormInfo })

	const addCondition = () => {
		let newCondition = { variable: '', operator: '=', value: '' }
		update({ condition: [...conditions, newCondition] })
	}

	const removeCondition = (index) => {
		update({ condition: conditions.filter((x, i) => i !== index) })
	}

	const updateCondition = (property, value, index) =>
		update({
			condition: [
				...conditions.slice(0, index),
				{ ...conditions[index], [property]: value },
				...conditions.slice(index + 1),
			],
		})

	return (
		<div>
			{conditions.map((condition, i) => (
				<ListItem key={condition.variable + i}>
					<Input.Group compact>
						<ValidatedSelect
							showSearch
							allowClear
							showArrow={false}
							placeholder="Variável"
							style={{
								width: '44%',
							}}
							options={variableOptions}
							defaultValue={condition?.variable || undefined}
							notFoundContent={'Variável não encontrada'}
							filterOption={(inputValue, option) =>
								option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
								-1
							}
							onChange={(v) => updateCondition('variable', v, i)}
							$error={!validConditionVars[i]}
						/>

						<Select
							placeholder=""
							style={{ width: '12%', textAlign: 'center' }}
							defaultValue={condition?.operator}
							onChange={(v) => updateCondition('operator', v, i)}>
							<Select.Option value="=">=</Select.Option>
							<Select.Option value="!=">!=</Select.Option>
							<Select.Option value=">">&gt;</Select.Option>
							<Select.Option value=">=">&gt;=</Select.Option>
							<Select.Option value="<">&lt;</Select.Option>
							<Select.Option value="<=">&lt;=</Select.Option>
						</Select>

						{(() => {
							let conditionType = variables.find(
								(x) => x && x.name === condition?.variable
							)?.type

							conditionType =
								conditionType in conditionalInputs ? conditionType : 'string'

							return conditionalInputs[conditionType]({
								style: { width: '44%' },
								defaultValue: condition.value,
								placeholder: 'Valor',
								onBlur: (v) => updateCondition('value', v, i),
							})
						})()}
					</Input.Group>

					<MinusCircleOutlined
						onClick={() => removeCondition(i)}
						style={{ padding: '0 10px' }}
					/>
				</ListItem>
			))}

			<Form.Item>
				<Button
					type="dashed"
					onClick={() => addCondition()}
					block
					icon={<PlusOutlined />}>
					Adicionar condicional
				</Button>
			</Form.Item>
		</div>
	)
}

WidgetConditional.propTypes = {
	data: object,
	variables: array,
	pageIndex: number,
	fieldIndex: number,
	onValidate: func,
	updateFormInfo: func,
}

export { WidgetConditional }
