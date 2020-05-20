import React from 'react'
import { string, oneOf, bool, array } from 'prop-types'
import { Form, Input, Radio } from 'antd'

function InputFactory({ name, label, type, isRequired, tree }) {
	console.log(name, label, type)
	function callBack(e) {
		console.log(e.target.value, tree)
		if (e.target.value) {
			tree.map((question) =>
				InputFactory({
					name: question.name,
					label: question.label,
					type: 'input',
				})
			)
		}
	}
	if (type === 'radio') {
		return (
			<Form.Item
				name={name}
				label={label}
				type={type}
				rules={[{ required: isRequired, message: 'Este campo é obrigatório!' }]}
				hasFeedback
				colon={false}>
				<Radio.Group onChange={(e) => callBack(e)}>
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
	tree: array,
	type: oneOf(['input', 'radio', 'checkbox', 'date']),
}

InputFactory.defaultProps = {
	type: 'input',
	isRequired: false,
	tree: [{ name: 'tree', label: 'tree label' }],
}

export default InputFactory
