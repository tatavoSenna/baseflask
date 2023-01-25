import React from 'react'
import { object } from 'prop-types'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, TextIcon } from './base/styles'
import { CurrencyInput } from './base/conditionalInputs'

export const CurrencyWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Moeda'}
			icon={<TextIcon $error={!valid}>$</TextIcon>}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />
					<FormItem label="Valor inicial">
						<CurrencyInput update={update} defaultValue={data.initialValue} />
					</FormItem>
				</div>
			}
			displayStyles={[
				{ value: 'plain', name: 'Plain' },
				{ value: 'extended', name: 'Extended' },
			]}
		/>
	)
})

CurrencyWidget.propTypes = {
	data: object,
}
