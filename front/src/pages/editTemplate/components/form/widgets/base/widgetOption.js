import React from 'react'
import { object, func } from 'prop-types'
import { Input, Button } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { FormItem, ListItem } from './styles'

export const WidgetOption = ({ options, update }) => {
	options = options ?? []

	const addOption = () => {
		let newOption = { label: '', value: '' }
		update({ options: [...options, newOption] })
	}

	const removeOption = (index) => {
		update({ options: options.filter((x, i) => i !== index) })
	}

	const updateOption = (property, value, index) =>
		update({
			options: [
				...options.slice(0, index),
				{ ...options[index], [property]: value },
				...options.slice(index + 1),
			],
		})

	return (
		<>
			<FormItem label="Opções">
				{options.map((option, i) => (
					<ListItem key={option.value + i}>
						<Input.Group compact>
							<Input
								placeholder="Título"
								style={{ width: '50%' }}
								defaultValue={option.label}
								onBlur={(e) => updateOption('label', e.target.value, i)}
							/>

							<Input
								placeholder="Valor"
								style={{ width: '50%' }}
								defaultValue={option.value}
								onBlur={(e) => updateOption('value', e.target.value, i)}
							/>
						</Input.Group>

						<MinusCircleOutlined
							onClick={() => removeOption(i)}
							style={{ padding: '0 10px' }}
						/>
					</ListItem>
				))}

				<FormItem>
					<Button
						type="dashed"
						onClick={() => addOption()}
						block
						icon={<PlusOutlined />}>
						Adicionar
					</Button>
				</FormItem>
			</FormItem>
		</>
	)
}

WidgetOption.propTypes = {
	options: object,
	update: func,
}
