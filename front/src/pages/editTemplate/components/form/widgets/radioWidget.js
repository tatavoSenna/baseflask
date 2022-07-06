import React from 'react'
import { object } from 'prop-types'
import { CheckCircleOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { WidgetOption } from './base/widgetOption'
import { styleIconValidation } from './base/styles'

export const RadioWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Rádio'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />
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

const Icon = styleIconValidation(CheckCircleOutlined)

RadioWidget.propTypes = {
	data: object,
}
