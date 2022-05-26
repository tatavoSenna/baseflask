import React from 'react'
import PropTypes, { string, shape, func, bool } from 'prop-types'
import { Form, Input } from 'antd'
import InfoField from '~/components/infoField'

const TextAreaField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
	disabled,
	visible,
}) => {
	const { label, variable, type, id, info, list, placeholder, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const { TextArea } = Input
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange ? (e) => onChange(e.target.value) : undefined}
			hasFeedback
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<TextArea
				autoFocus={first}
				autoSize={true}
				placeholder={placeholder}
				disabled={disabled}
			/>
		</Form.Item>
	)
}

TextAreaField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		type: string.isRequired,
		info: string,
	}).isRequired,
	inputValue: string,
	className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	onChange: func,
	first: bool,
	disabled: bool,
	visible: bool,
}

TextAreaField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
	visible: true,
}

export default TextAreaField
