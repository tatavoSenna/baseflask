import React from 'react'
import { object, func, number, array } from 'prop-types'
import { Form, Input, Select, Button, AutoComplete, Switch } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useUpdate } from './fieldBase'
import { FormItem } from './styles'
import { CurrencyInput } from './currencyField'

const TextInput = ({ onBlur, ...props }) => (
	<Input
		{...props}
		placeholder="Valor"
		onBlur={(e) => onBlur(e.target.value)}
	/>
)

TextInput.propTypes = {
	onBlur: func,
}

const conditionalInputs = {
	string: TextInput,
	currency: CurrencyInput,
}

const FieldConditional = ({
	data,
	variables,
	pageIndex,
	fieldIndex,
	updateFormInfo,
}) => {
	const variableNames = variables
		.filter((x) => Object.keys(conditionalInputs).includes(x.type))
		.map((x) => x?.name)

	const variableOptions = variableNames
		.filter((x, i, arr) => arr.indexOf(x) === i) // Checks unique
		.filter((x) => x && x !== data?.variable?.name)
		.map((x) => ({ value: x }))

	const conditions =
		'condition' in data
			? Array.isArray(data.condition)
				? data.condition
				: [data.condition]
			: []

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
			<FormItem label="Condicional" $labelWidth={'91%'}>
				<Switch
					defaultChecked={data.conditional}
					onChange={(e) => update({ conditional: e })}
				/>
			</FormItem>
			{conditions.map((condition, i) => (
				<div
					key={condition.variable + i}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: '8px',
					}}>
					<Input.Group compact>
						<AutoComplete
							placeholder="Variável"
							style={{
								width: '44%',
							}}
							options={variableOptions}
							defaultValue={condition?.variable}
							filterOption={(inputValue, option) =>
								option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
								-1
							}
							onBlur={(e) => updateCondition('variable', e.target.value, i)}
						/>

						<Select
							placeholder=""
							style={{ width: '11%', textAlign: 'center' }}
							defaultValue={condition?.operator}
							onChange={(v) => updateCondition('operator', v, i)}>
							<Select.Option value="=">=</Select.Option>
							<Select.Option value=">">&gt;</Select.Option>
							<Select.Option value=">=">&gt;=</Select.Option>
							<Select.Option value="<">&lt;</Select.Option>
							<Select.Option value="<=">&lt;=</Select.Option>
						</Select>

						{(() => {
							let conditionType = variables.find(
								(x) => x.name === condition?.variable
							)?.type

							conditionType =
								conditionType in conditionalInputs ? conditionType : 'string'

							return conditionalInputs[conditionType]({
								style: { width: '45%' },
								defaultValue: condition.value,
								onBlur: (v) => updateCondition('value', v, i),
							})
						})()}
					</Input.Group>

					<MinusCircleOutlined
						onClick={() => removeCondition(i)}
						style={{ padding: '0 0 0 10px' }}
					/>
				</div>
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

FieldConditional.propTypes = {
	data: object,
	variables: array,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}

export { FieldConditional }
