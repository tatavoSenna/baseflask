import React, { useEffect, useMemo } from 'react'
import { string, shape, object, func, bool, oneOfType, array } from 'prop-types'
import { Form } from 'antd'

import InfoField from '~/components/infoField'
import ImageUpload from 'components/imageUpload'

const ImageField = ({
	pageFieldsData,
	inputValue,
	className,
	visible,
	form,
	onChange,
}) => {
	const { label, variable, info, optional, multiple } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = `image_${isObj ? variable.name : variable}`

	const handleChange = (value) => {
		if (form)
			form.setFieldsValue({
				[varname]: value,
			})

		if (onChange) onChange(value)
	}

	// Sets the initial value in form
	useEffect(() => {
		if (form.getFieldValue(varname) === undefined) {
			form.setFieldsValue({
				[varname]: inputValue,
			})
		}
	}, [form, inputValue, varname])

	let initialValue = useMemo(() => {
		return form.getFieldValue(varname) ?? inputValue
	}, [form, varname, inputValue])

	return (
		<Form.Item
			key={`imageField_${isObj ? variable.name : variable}`}
			name={varname}
			label={<InfoField label={label} info={info} />}
			className={className}
			colon={false}
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}>
			<ImageUpload
				initialValue={initialValue}
				onChange={handleChange}
				multiple={multiple ?? false}
			/>
		</Form.Item>
	)
}

ImageField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		info: string,
	}).isRequired,
	onChange: func,
	className: string,
	form: object,
	inputValue: oneOfType([string, array]),
	visible: bool,
}

ImageField.defaultProps = {
	visible: true,
}

export default ImageField
