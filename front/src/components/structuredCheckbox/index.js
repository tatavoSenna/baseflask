import React, { useState } from 'react'
import { string, object, func, shape, number, bool } from 'prop-types'
import InfoField from '~/components/infoField'
import InputFactory from '../inputFactory'
import { Card, Form, Checkbox, Row } from 'antd'

const StructuredCheckbox = ({
	pageFieldsData,
	className,
	onChange,
	pageIndex,
	fieldIndex,
	disabled,
}) => {
	const { label, variable, structure, options, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const listName = `structured_checkbox_${pageIndex}_${fieldIndex}`
	const name = isObj ? variable.name : variable
	const [visible, setVisible] = useState(Array(options.length).fill(false))
	const updateVisible = (value, index) => {
		const newVisible = [...visible]
		newVisible[index] = value
		setVisible(newVisible)
	}
	const selected = []
	options.forEach((option) => {
		if (option.checked === true) {
			selected.push(option.value)
		}
	})
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={[listName, name]}
			label={<InfoField label={label} info={info} />}
			className={className}
			onChange={onChange}
			hasFeedback
			type={type}
			initialValue={selected}
			colon={false}>
			<Checkbox.Group>
				<Card>
					{options.map((option, index) => {
						// This next line allows you to manipulate the object
						const pageFieldsData = JSON.parse(JSON.stringify(structure))
						pageFieldsData.forEach((field) => {
							if (field.type === 'separator') {
								return
							}
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
										disabled={disabled}
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
										disabled={disabled}
										initialValues={
											option.checked && field.type !== 'separator'
												? {
														[field.variable.name]:
															option['struct_values'][field.variable.name],
												  }
												: ''
										}
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

StructuredCheckbox.propTypes = {
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
	disabled: bool,
}

StructuredCheckbox.defaultProps = {
	className: {},
	onChange: () => null,
}

export default StructuredCheckbox
