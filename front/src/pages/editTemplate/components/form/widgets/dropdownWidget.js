import React, { useEffect } from 'react'
import { object, number, func } from 'prop-types'
import { Select } from 'antd'
import { DownSquareOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { WidgetOption } from './base/widgetOption'
import { FormItem, styleIconValidation } from './base/styles'

export const DropdownWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	useEffect(() => {
		const values = data.options.map((o) => o?.value)

		if (data.initialValue !== '' && !values.includes(data.initialValue))
			update({ initialValue: '' })
	}, [data.options, data.initialValue, update])

	return (
		<Widget
			{...props}
			type={'Dropdown'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<FormItem label="Valor inicial">
						<Select
							showSearch={true}
							allowClear={true}
							notFoundContent={''}
							value={data.initialValue}
							onChange={(v) => update({ initialValue: v })}>
							{data.options.map(({ label, value }, index) => (
								<Select.Option key={index} value={value}>
									{label}
								</Select.Option>
							))}
						</Select>
					</FormItem>

					<WidgetOption options={data.options} update={update} />
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

const Icon = styleIconValidation(DownSquareOutlined)

DropdownWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
