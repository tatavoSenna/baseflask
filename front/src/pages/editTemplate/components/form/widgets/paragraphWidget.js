import React from 'react'
import { object } from 'prop-types'
import { Input } from 'antd'
import { AlignLeftOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'

export const ParagraphWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Parágrafo'}
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
						<Input.TextArea
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

const Icon = styleIconValidation(AlignLeftOutlined)

ParagraphWidget.propTypes = {
	data: object,
}