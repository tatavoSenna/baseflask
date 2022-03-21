import React, { useState } from 'react'
import { object, number, func } from 'prop-types'
import { Input, InputNumber } from 'antd'
import { Field, useUpdate } from './fieldBase'
import { FormItem, TextIcon } from './styles'
import {
	currencyFormatter,
	currencyParser,
} from 'components/currencyField/currencyUtils'

export const CurrencyField = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useState(false)

	return (
		<Field
			{...props}
			type={'Moeda'}
			icon={<TextIcon $error={!valid}>$</TextIcon>}
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
}

CurrencyField.propTypes = {
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
