import React from 'react'
import { object, func } from 'prop-types'
import { Form, Input } from 'antd'

const Signers = ({ data, updateForm }) => {
	return (
		<Form.Item
			name="signers"
			onChange={(e) => updateForm(e, 'signers')}
			value={data.signers}>
			<Input.TextArea
				style={{
					width: '100%',
					height: '42rem',
				}}
			/>
		</Form.Item>
	)
}

export default Signers

Signers.propTypes = {
	data: object,
	updateForm: func,
}
