import React, { useState } from 'react'
import { object, number, func, array, string, oneOfType } from 'prop-types'
import { Input, Select } from 'antd'
import { FontSizeOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'

export const TextWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Texto'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />
					<FormItem label="Placeholder">
						<Input
							onBlur={(e) => update({ placeholder: e.target.value })}
							defaultValue={data.placeholder}
							autoComplete="off"
						/>
					</FormItem>

					<FormItem label="Valor inicial">
						<Input
							onBlur={(e) => update({ initialValue: e.target.value })}
							defaultValue={data.initialValue}
							autoComplete="off"
						/>
					</FormItem>
				</div>
			}
			displayStyles={[
				{ value: 'plain', name: 'Plain' },
				{ value: 'uppercase', name: 'Uppercase' },
				{ value: 'lowercase', name: 'Lowercase' },
				{ value: 'sentence_case', name: 'Sentence case' },
			]}
		/>
	)
})

const Icon = styleIconValidation(FontSizeOutlined)

TextWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}

export const TextInput = ({ changeCallback, defaultValue, ...props }) => {
	const [options, setOptions] = useState([])
	return (
		<Select
			{...props}
			defaultValue={defaultValue !== '' ? defaultValue : undefined}
			mode="multiple"
			size="default"
			options={options}
			filterOption={false}
			onSearch={(s) => setOptions([{ label: s, value: s }])}
			onChange={(v) => {
				setOptions([])

				switch (v.length) {
					case 0:
						changeCallback('')
						break
					case 1:
						changeCallback(v[0])
						break
					default:
						changeCallback(v)
				}
			}}
			notFoundContent={null}
		/>
	)
}

TextInput.propTypes = {
	changeCallback: func,
	defaultValue: oneOfType([array, string]),
}
