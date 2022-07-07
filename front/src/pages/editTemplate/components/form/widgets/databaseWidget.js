import React, { useCallback } from 'react'
import { object } from 'prop-types'
import { Input } from 'antd'
import { ApiOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'

export const DatabaseWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	const updateVariable = useCallback(
		(key, value) => {
			update({ variable: { ...data.variable, [key]: value } })
		},
		[data, update]
	)

	return (
		<Widget
			{...props}
			type={'API'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<FormItem label="Endpoint">
						<Input
							onBlur={(e) =>
								updateVariable('database_endpoint', e.target.value)
							}
							defaultValue={data?.variable?.database_endpoint}
							autoComplete="off"
						/>
					</FormItem>

					<FormItem label="Atributos">
						<Input.Group compact>
							<Input
								placeholder="Índice"
								onBlur={(e) => updateVariable('search_key', e.target.value)}
								defaultValue={data?.variable?.search_key}
								autoComplete="off"
								style={{
									width: '50%',
									textAlignLast: 'center',
								}}
							/>

							<Input
								placeholder="Exibição"
								onBlur={(e) => updateVariable('display_key', e.target.value)}
								defaultValue={data?.variable?.display_key}
								autoComplete="off"
								style={{
									width: '50%',
									textAlignLast: 'center',
								}}
							/>
						</Input.Group>
					</FormItem>
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(ApiOutlined)

DatabaseWidget.propTypes = {
	data: object,
}
