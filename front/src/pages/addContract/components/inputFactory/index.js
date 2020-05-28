import React from 'react'
import { object } from 'prop-types'
import { Form, Input, Radio } from 'antd'

function InputFactory({ content }) {
	const children = []

	for (let i = 0; i < content.length; i++) {
		const { value, variable, type, options, id } = content[i]
		if (type === 'input') {
			children.push(
				<Form.Item
					key={`${variable}_${id}`}
					name={variable}
					label={value}
					type={type}
					hasFeedback
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
					colon={false}>
					<Input placeholder="" />
				</Form.Item>
			)
		} else if (type === 'radio') {
			children.push(
				<Form.Item
					key={`${variable}_${id}`}
					name={variable}
					label={value}
					hasFeedback
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
					type={type}
					colon={false}>
					<Radio.Group>
						<Radio value={true}>{options[0]}</Radio>
						<Radio value={false}>{options[1]}</Radio>
					</Radio.Group>
				</Form.Item>
			)
		}
	}

	return children
}

InputFactory.propTypes = {
	content: object.isRequired,
}

export default InputFactory
