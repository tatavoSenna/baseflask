import React, { useState } from 'react'
import { object, number, func } from 'prop-types'
import { Input, InputNumber } from 'antd'
import { Field, useUpdate } from './fieldBase'
import { FormItem, TextIcon } from './styles'
import {
	currencyFormatter,
	currencyParser,
} from 'components/currencyField/currencyUtils'

const CurrencyField = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useState(false)

	const parser = currencyParser()

	return (
		<Field
			{...props}
			type={'Moeda'}
			icon={<TextIcon $error={!valid}>$</TextIcon>}
			onValidate={setValid}
			formItems={
				<div>
					<FormItem label="Título" $labelWidth={'17%'}>
						<Input
							onBlur={(e) => update({ label: e.target.value })}
							defaultValue={data.label}
							autoComplete="off"
						/>
					</FormItem>

					<FormItem label="Descrição" $labelWidth={'17%'}>
						<Input
							onBlur={(e) => update({ info: e.target.value })}
							defaultValue={data.info}
							autoComplete="off"
						/>
					</FormItem>

					<FormItem label="Valor inicial" $labelWidth={'17%'}>
						<InputNumber
							min={0}
							placeholder=""
							formatter={currencyFormatter()}
							parser={parser}
							style={{ width: '100%', currency: 'BRL', style: 'currency' }}
							onBlur={(e) => update({ initialValue: parser(e.target.value) })}
							defaultValue={data.initialValue}
							autoComplete="off"
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

export default CurrencyField

CurrencyField.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
