import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input } from 'antd'

const Text = ({ data, updateForm }) => {
	return (
		<Form.Item
			name="text"
			onChange={(e) => updateForm(e, 'text')}
			value={data.text}>
			<Input.TextArea
				style={{
					width: '100%',
					height: '42rem',
				}}
			/>
		</Form.Item>
	)
}

export default Text

Text.propTypes = {
	data: object,
	updateForm: func,
}
