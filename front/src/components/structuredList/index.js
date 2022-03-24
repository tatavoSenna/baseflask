import React from 'react'
import { string, object, func, shape, number } from 'prop-types'
import { Card, Form, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import InfoField from '~/components/infoField'
import StructuredVariable from './variable'

const StructuredList = ({
	pageFieldsData,
	className,
	onChange,
	pageIndex,
	fieldIndex,
}) => {
	const { label, variable, structure, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			label={<InfoField label={label} info={info} />}
			className={className}
			onChange={onChange}
			hasFeedback
			type={type}
			colon={false}>
			<Card>
				<Form.List name={`structured_list_${pageIndex}_${fieldIndex}`}>
					{(fields, { add, remove }) => {
						return (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }, i) => (
									<StructuredVariable
										key={i}
										index={key}
										name={name}
										fieldKey={fieldKey}
										restField={restField}
										remove={remove}
										structure={structure}
									/>
								))}

								<Form.Item style={{ margin: '0' }}>
									<Button
										type="dashed"
										onClick={() => add()}
										block
										icon={<PlusOutlined />}>
										Adicionar Campo
									</Button>
								</Form.Item>
							</>
						)
					}}
				</Form.List>
			</Card>
		</Form.Item>
	)
}

StructuredList.propTypes = {
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
}

StructuredList.defaultProps = {
	className: {},
	onChange: () => null,
}

export default StructuredList
