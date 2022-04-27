import React from 'react'
import { object, number, func } from 'prop-types'
import { DatePicker } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'
import { validateDate } from 'utils'

export const DateWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Data'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />
					<FormItem label="Valor inicial">
						<DatePicker
							placeholder=""
							format={'DD-MM-YYYY'}
							onBlur={(e) => update({ initialValue: e.target.value })}
							defaultValue={validateDate(data.initialValue)}
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
})

const Icon = styleIconValidation(CalendarOutlined)

DateWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
