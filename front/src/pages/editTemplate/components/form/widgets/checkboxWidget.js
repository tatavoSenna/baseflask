import React from 'react'
import { object, number, func } from 'prop-types'
import { Input } from 'antd'
import { CheckSquareOutlined } from '@ant-design/icons'

import { WidgetOption } from './base/widgetOption'
import { Widget, useUpdate, useValidation } from './base/widget'
import { FormItem, styleIconValidation } from './base/styles'

export const CheckboxWidget = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Caixa de seleção'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<FormItem label="Título">
						<Input
							onBlur={(e) => update({ label: e.target.value })}
							defaultValue={data.label}
							autoComplete="off"
						/>
					</FormItem>

					<FormItem label="Descrição">
						<Input
							onBlur={(e) => update({ info: e.target.value })}
							defaultValue={data.info}
							autoComplete="off"
						/>
					</FormItem>

					<WidgetOption options={data.options} update={update} />
				</div>
			}
			displayStyles={[
				{ value: 'commas', name: 'Vírgulas' },
				{ value: 'bullets', name: 'Tópicos' },
			]}
		/>
	)
}

const Icon = styleIconValidation(CheckSquareOutlined)

CheckboxWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
