import React, { useState } from 'react'
import { object } from 'prop-types'
import { InputNumber, TimePicker } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

import { CommonFields } from './base/widgetCommonFields'
import { Widget, useUpdate, useValidation } from './base/widget'
import { FormItem, styleIconValidation } from './base/styles'

export const TimeWidget = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)
	const [step, setStep] = useState(4)

	const checkStep = (value, info) => {
		if (info['type'] === 'up') {
			if (value === 5) setStep(5)
			else if (value === 20) setStep(10)
		} else if (info['type'] === 'down') {
			if (value === 20) setStep(5)
			else if (value === 5) setStep(4)
		}
	}

	return (
		<Widget
			{...props}
			type={'Hora'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<FormItem label="Valor inicial" $width={'60%'}>
							<TimePicker
								allowClear={true}
								placeholder=""
								format={'HH:mm'}
								onChange={(v) =>
									update({ initialValue: v ? v.format('HH:mm') : '' })
								}
								defaultValue={
									data.initialValue !== ''
										? moment(data.initialValue, 'HH:mm')
										: undefined
								}
								minuteStep={data.minute_step || undefined}
								style={{ width: '100%' }}
							/>
						</FormItem>

						<FormItem label="Incremento" $width={'35%'}>
							<InputNumber
								min={1}
								max={30}
								step={step}
								onBlur={(e) => update({ minute_step: Number(e.target.value) })}
								onStep={(e, info) => checkStep(e, info)}
								defaultValue={data.minute_step ? data.minute_step : 1}
								style={{ width: '100%' }}
							/>
						</FormItem>
					</div>
				</div>
			}
		/>
	)
}

const Icon = styleIconValidation(ClockCircleOutlined)

TimeWidget.propTypes = {
	data: object,
}
