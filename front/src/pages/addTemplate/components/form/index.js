import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input, Typography } from 'antd'

const TemplateForm = ({ data, updateForm }) => {
	const { Title } = Typography

	return (
		<>
			<Title>Formulário</Title>
			<Form.Item
				name="form"
				onChange={(e) => updateForm(e, 'form')}
				value={data.form}>
				<Input.TextArea autoSize={true} />
			</Form.Item>
		</>
	)
}

export default TemplateForm

TemplateForm.propTypes = {
	data: object,
	updateForm: func,
}
