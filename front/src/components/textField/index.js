import React from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, Input } from 'antd'
import InfoField from '~/components/infoField'

const TextField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
	disabled,
}) => {
	const { label, variable, type, id, info, list, placeholder } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				!hidden && [{ required: true, message: 'Este campo é obrigatório.' }]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Input autoFocus={first} placeholder={placeholder} disabled={disabled} />
		</Form.Item>
	)
}

TextField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		type: string.isRequired,
		info: string,
	}).isRequired,
	inputValue: string,
	className: object,
	onChange: func,
	first: bool,
	disabled: bool,
}

TextField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
}

export default TextField
