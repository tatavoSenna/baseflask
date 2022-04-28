import React from 'react'
import { object, number, func } from 'prop-types'
import { CheckSquareOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { WidgetOption } from './base/widgetOption'
import { styleIconValidation } from './base/styles'

export const CheckboxWidget = React.memo((props) => {
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
					<CommonFields data={data} update={update} />
					<WidgetOption options={data.options} update={update} />
				</div>
			}
			displayStyles={[
				{ value: 'commas', name: 'Vírgulas' },
				{ value: 'bullets', name: 'Tópicos' },
			]}
		/>
	)
})

const Icon = styleIconValidation(CheckSquareOutlined)

CheckboxWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
