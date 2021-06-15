import React from 'react'
import { object, bool } from 'prop-types'
import { Form, Typography, Divider } from 'antd'
import InputFactory from '~/components/inputFactory'

const { Title } = Typography

const StructuredList = ({ item, disabled }) => {
	return (
		<>
			<Title
				level={4}
				style={{ marginTop: 10, marginBottom: '24px', fontSize: 15 }}>
				{item.subtitle}
			</Title>
			<Form.Item hasFeedback colon={false}>
				{item.items.map((data, i) =>
					data.map((field, index) => {
						const fieldData = JSON.parse(JSON.stringify(field))
						fieldData['variable'] = fieldData['variable'] + `_${i}`
						fieldData['list'] = item['struct_name']
						return (
							<div style={{ paddingLeft: '15px' }}>
								<InputFactory
									key={i}
									data={[fieldData]}
									visible={[true]}
									disabled={disabled}
									initialValues={[fieldData.value]}
								/>
								{data.length - 1 === index && i < item.items.length - 1 && (
									<Divider />
								)}
							</div>
						)
					})
				)}
			</Form.Item>
		</>
	)
}

StructuredList.propTypes = {
	item: object,
	disabled: bool,
}

export default StructuredList
