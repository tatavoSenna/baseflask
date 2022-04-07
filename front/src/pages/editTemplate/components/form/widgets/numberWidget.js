import React from 'react'
import { object, number, func } from 'prop-types'
import { Input, InputNumber } from 'antd'
import { FieldNumberOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { FormItem, styleIconValidation } from './base/styles'
import { validateNumber } from 'utils'

export const NumberWidget = (props) => {
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
									onBlur={(e) =>
										update({ min: validateNumber(e.target.value, '') })
									}
									defaultValue={data.min}
									style={{
										width: '41%',
										textAlignLast: 'center',
										borderRight: 0,
									}}
									placeholder="Mínimo"
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
									onBlur={(e) =>
										update({ max: validateNumber(e.target.value, '') })
									}
									defaultValue={data.max}
									style={{
										width: '41%',
										textAlignLast: 'center',
										borderLeft: 0,
									}}
									placeholder="Máximo"
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
}

const Icon = styleIconValidation(FieldNumberOutlined)

NumberWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}

export const NumberInput = ({ onBlur, ...props }) => (
	<InputNumber {...props} onBlur={(e) => onBlur(Number(e.target.value))} />
)

NumberInput.propTypes = {
	onBlur: func,
}
