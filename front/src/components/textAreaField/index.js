import React from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form, Input } from 'antd'
import InfoField from '~/components/infoField'

const TextAreaField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
}) => {
	const { label, variable, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const { TextArea } = Input
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<TextArea autoFocus={first} autoSize={true} placeholder="" />
		</Form.Item>
	)
}

TextAreaField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	inputValue: string,
	className: object,
	onChange: func,
	first: bool,
}

TextAreaField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
}

export default TextAreaField
