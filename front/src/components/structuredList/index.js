import React from 'react'
import { string, object, func, shape, number, bool } from 'prop-types'
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
	visible,
	form,
}) => {
	const { label, variable, structure, type, id, info, initialValue, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'

	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			label={<InfoField label={label} info={info} />}
			className={className}
			onChange={onChange}
			hasFeedback
			type={type}
			colon={false}
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}>
			<Card>
				<Form.List name={variable.name} initialValue={initialValue || []}>
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
										form={form}
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
	className: string,
	onChange: func,
	pageIndex: number,
	fieldIndex: number,
	visible: bool,
	form: object,
}

StructuredList.defaultProps = {
	onChange: () => null,
	visible: true,
}

export default StructuredList
