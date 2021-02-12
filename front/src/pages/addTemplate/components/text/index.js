import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input, Typography } from 'antd'

const Text = ({ data, updateForm }) => {
	const { Title } = Typography

	return (
		<>
			<Title>Texto</Title>
			<Form.Item
				name="text"
				onChange={(e) => updateForm(e, 'text')}
				value={data.text}>
				<Input.TextArea autoSize={true} />
			</Form.Item>
		</>
	)
}

export default Text

Text.propTypes = {
	data: object,
	updateForm: func,
}
