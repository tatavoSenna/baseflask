import React from 'react'
import { object, number, func } from 'prop-types'
import { InputNumber } from 'antd'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, TextIcon } from './base/styles'
import {
	currencyFormatter,
	currencyParser,
} from 'components/currencyField/currencyUtils'

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
						<CurrencyInput
							onBlur={(v) => update({ initialValue: v })}
							defaultValue={data.initialValue}
						/>
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
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}

export const CurrencyInput = ({ defaultValue, onBlur, style = {} }) => {
	const parser = currencyParser()

	return (
		<InputNumber
			min={0}
			placeholder=""
			formatter={currencyFormatter()}
			parser={parser}
			style={{ width: '100%', currency: 'BRL', style: 'currency', ...style }}
			onBlur={(e) => onBlur(Number(parser(e.target.value)))}
			defaultValue={defaultValue}
			autoComplete="off"
		/>
	)
}

CurrencyInput.propTypes = {
	defaultValue: number,
	onBlur: func,
	style: object,
}
