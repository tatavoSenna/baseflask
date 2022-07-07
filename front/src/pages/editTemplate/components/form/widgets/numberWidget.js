import React from 'react'
import { object } from 'prop-types'
import { Input, InputNumber } from 'antd'
import { FieldNumberOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'
import { validateNumber } from 'utils'

export const NumberWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Número'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<FormItem label="Valor inicial" $width={'59%'}>
							<InputNumber
								onBlur={(e) =>
									update({ initialValue: validateNumber(e.target.value, '') })
								}
								defaultValue={data.initialValue}
								precision={data.decimals || undefined}
								step={data.step || undefined}
								style={{ width: '100%' }}
							/>
						</FormItem>

						<FormItem label="Decimais" $width={'37%'}>
							<InputNumber
								min={0}
								onBlur={(e) =>
									update({ decimals: validateNumber(e.target.value, '') })
								}
								defaultValue={data.decimals}
								style={{ width: '100%' }}
							/>
						</FormItem>
					</div>

					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<FormItem label="Intervalo" $width={'59%'}>
							<Input.Group compact>
								<InputNumber
									placeholder="Mínimo"
									defaultValue={data.min}
									step={data.step || undefined}
									onBlur={(e) =>
										update({ min: validateNumber(e.target.value, '') })
									}
									style={{
										width: '41%',
										textAlignLast: 'center',
										borderRight: 0,
									}}
								/>
								<Input
									style={{
										width: '18%',
										borderLeft: 0,
										pointerEvents: 'none',
										backgroundColor: '#fff',
									}}
									placeholder="~"
									disabled
								/>
								<InputNumber
									placeholder="Máximo"
									defaultValue={data.max}
									step={data.step || undefined}
									onBlur={(e) =>
										update({ max: validateNumber(e.target.value, '') })
									}
									style={{
										width: '41%',
										textAlignLast: 'center',
										borderLeft: 0,
									}}
								/>
							</Input.Group>
						</FormItem>

						<FormItem label="Incremento" $width={'37%'}>
							<InputNumber
								min={0}
								onBlur={(e) =>
									update({ step: validateNumber(e.target.value, '') })
								}
								defaultValue={data.step}
								style={{ width: '100%' }}
							/>
						</FormItem>
					</div>
				</div>
			}
			displayStyles={[
				{ value: 'plain', name: 'Plain' },
				{ value: 'extended', name: 'Extended' },
				{ value: 'ordinal', name: 'Ordinal' },
			]}
		/>
	)
})

const Icon = styleIconValidation(FieldNumberOutlined)

NumberWidget.propTypes = {
	data: object,
}
