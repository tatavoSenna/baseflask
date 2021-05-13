import React, { useState } from 'react'
import { string, object, func, shape, number } from 'prop-types'
import InfoField from '~/components/infoField'
import InputFactory from '../inputFactory'
import { Card, Form, Checkbox, Row } from 'antd'

const DetailedCheckbox = ({
	pageFieldsData,
	className,
	onChange,
	pageIndex,
	fieldIndex,
}) => {
	const { label, variable, structure, options, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const listName = `detailedCheckbox_${pageIndex}_${fieldIndex}`
	const name = isObj ? variable.name : variable
	const [visible, setVisible] = useState(Array(options.length).fill(false))
	const updateVisible = (value, index) => {
		const newVisible = [...visible]
		newVisible[index] = value
		setVisible(newVisible)
	}
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={[listName, name]}
			label={<InfoField label={label} info={info} />}
			className={className}
			onChange={onChange}
			hasFeedback
			type={type}
			colon={false}>
			<Checkbox.Group>
				<Card>
					{options.map((option, index) => {
						const pageFieldsData = JSON.parse(JSON.stringify(structure))
						pageFieldsData.forEach((field) => {
							field['id'] = option.value
							field['list'] = listName
						})
						return (
							<>
								<Row>
									<Checkbox
										key={index}
										value={option.value}
										style={{ marginTop: '10px', marginBottom: '10px' }}
										onChange={(value) =>
											updateVisible(value.target.checked, index)
										}>
										{option.label}
									</Checkbox>
								</Row>
								{pageFieldsData.map((field) => (
									<InputFactory
										data={[field]}
										visible={Array(visible[index])}
									/>
								))}
							</>
						)
					})}
				</Card>
			</Checkbox.Group>
		</Form.Item>
	)
}

DetailedCheckbox.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	pageIndex: number,
	fieldIndex: number,
	listIndex: number,
}

DetailedCheckbox.defaultProps = {
	className: {},
	onChange: () => null,
}

export default DetailedCheckbox
