import React from 'react'
import { string, oneOf, bool } from 'prop-types'
import { Form, Input, Radio } from 'antd'

function InputFactory({ name, label, type, isRequired }) {
	if (type === 'radio') {
		return (
			<Form.Item
				name={name}
				label={label}
				type={type}
				rules={[{ required: isRequired, message: 'Este campo é obrigatório!' }]}
				hasFeedback
				colon={false}>
				<Radio.Group>
					<Radio value={true}>Sim</Radio>
					<Radio value={false}>Nao</Radio>
				</Radio.Group>
			</Form.Item>
		)
	}
	return (
		<Form.Item
			name={name}
			label={label}
			type={type}
			rules={[{ required: isRequired, message: 'Este campo é obrigatório!' }]}
			hasFeedback
			colon={false}>
			<Input />
		</Form.Item>
	)
}

InputFactory.propTypes = {
	name: string.isRequired,
	label: string.isRequired,
	isRequired: bool,
	type: oneOf(['input', 'radio', 'checkbox', 'date']),
}

InputFactory.defaultProps = {
	type: 'input',
	isRequired: false,
}

export default InputFactory
