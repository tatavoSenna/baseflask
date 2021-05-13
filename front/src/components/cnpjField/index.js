import React from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form } from 'antd'
import { validateCNPJ } from '../../utils'
import MaskedInput from 'antd-mask-input'
import InfoField from '~/components/infoField'

const CnpjField = ({ pageFieldsData, className, onChange, first }) => {
	const { label, variable, type, id, info, list } = pageFieldsData
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
				!hidden && [
					() => ({
						validator(rule, value) {
							if (!value) {
								return Promise.reject('Este campo é obrigatório.')
							}
							if (validateCNPJ(value)) {
								return Promise.resolve()
							}
							return Promise.reject('CNPJ não é válido.')
						},
					}),
				]
			}
			colon={false}>
			<MaskedInput autoFocus={first} mask="11.111.111/1111-11" placeholder="" />
		</Form.Item>
	)
}

CnpjField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	first: bool,
}

CnpjField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CnpjField
