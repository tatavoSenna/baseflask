import React, { useState } from 'react'
import { object, number, func } from 'prop-types'
import { Input, DatePicker } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

import { Field, useUpdate } from './fieldBase'
import { FormItem, styleIconValidation } from './styles'
import moment from 'moment'

export const DateField = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useState(false)

	return (
		<Field
			{...props}
			type={'Data'}
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
						<DatePicker
							placeholder=""
							format={'DD-MM-YYYY'}
							onBlur={(e) => update({ initialValue: e.target.value })}
							defaultValue={
								data.initialValue !== ''
									? moment(data.initialValue, 'DD-MM-YYYY')
									: ''
							}
						/>
					</FormItem>
				</div>
			}
			displayStyles={[
				{ value: '%d/%m/%Y', name: 'Day/month/year' },
				{ value: 'extended', name: 'Extended' },
			]}
		/>
	)
}

const Icon = styleIconValidation(CalendarOutlined)

DateField.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
