import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input } from 'antd'

const Workflow = ({ data, updateForm }) => {
	return (
		<Form.Item
			name="workflow"
			onChange={(e) => updateForm(e, 'workflow')}
			value={data.workflow}>
			<Input.TextArea
				style={{
					width: '100%',
					height: '42rem',
				}}
			/>
		</Form.Item>
	)
}

export default Workflow

Workflow.propTypes = {
	data: object,
	updateForm: func,
}
