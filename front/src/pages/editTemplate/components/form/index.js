import React from 'react'
import { string, func } from 'prop-types'
import { Form, Input } from 'antd'

const TemplateForm = ({ data, updateForm }) => {
	return (
		<Form.Item
			name="form"
			onChange={(e) => updateForm(e, 'form')}
			initialValue={!data.form ? '' : data.form}>
			<Input.TextArea
				style={{
					width: '100%',
					height: '42rem',
				}}
			/>
		</Form.Item>
	)
}

export default TemplateForm

TemplateForm.propTypes = {
	data: string,
	updateForm: func,
}
