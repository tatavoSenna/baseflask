import React from 'react'
import { object } from 'prop-types'
import { BankOutlined } from '@ant-design/icons'
import { Select } from 'antd'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'

import bank from 'components/bankField/bankName'
import { filterText } from 'services/filter'

export const BankWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Banco'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />
					<FormItem label="Valor inicial">
						<Select
							showSearch={true}
							allowClear={true}
							filterOption={filterText}
							value={data.initialValue}
							onChange={(v) => update({ initialValue: v })}>
							{bank.names.map((option, index) => (
								<Select.Option key={index} value={option}>
									{option}
								</Select.Option>
							))}
						</Select>
					</FormItem>
				</div>
			}
			displayStyles={[
				{ value: 'plain', name: 'Plain' },
				{ value: 'uppercase', name: 'Uppercase' },
				{ value: 'lowercase', name: 'Lowercase' },
				{ value: 'sentence_case', name: 'Sentence case' },
			]}
		/>
	)
})

const Icon = styleIconValidation(BankOutlined)

BankWidget.propTypes = {
	data: object,
}
