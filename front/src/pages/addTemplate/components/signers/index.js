import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input, Typography } from 'antd'

const Signers = ({ data, updateForm }) => {
	const { Title } = Typography

	return (
		<>
			<Title>Assinantes</Title>
			<Form.Item
				name="signers"
				onChange={(e) => updateForm(e, 'signers')}
				value={data.signers}>
				<Input.TextArea autoSize={true} />
			</Form.Item>
		</>
	)
}

export default Signers

Signers.propTypes = {
	data: object,
	updateForm: func,
}
