import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input, Typography } from 'antd'

const Workflow = ({ data, updateForm }) => {
	const { Title } = Typography

	return (
		<>
			<Title>Workflow</Title>
			<Form.Item
				name="workflow"
				onChange={(e) => updateForm(e, 'workflow')}
				value={data.workflow}>
				<Input.TextArea autoSize={true} />
			</Form.Item>
		</>
	)
}

export default Workflow

Workflow.propTypes = {
	data: object,
	updateForm: func,
}
