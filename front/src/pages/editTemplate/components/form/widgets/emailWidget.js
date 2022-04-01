import React from 'react'
import { object, number, func } from 'prop-types'
import { Input } from 'antd'
import { MailOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { FormItem, styleIconValidation } from './base/styles'

export const EmailWidget = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Email'}
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

					<FormItem label="Valor inicial">
						<Input
							onBlur={(e) => update({ initialValue: e.target.value })}
							defaultValue={data.initialValue}
							autoComplete="email"
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
}

const Icon = styleIconValidation(MailOutlined)

EmailWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
