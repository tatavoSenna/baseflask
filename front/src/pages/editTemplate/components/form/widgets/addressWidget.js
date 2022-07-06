import React from 'react'
import { object } from 'prop-types'
import { Select } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'

export const AddressWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	const fieldOptions = [
		{ label: 'CEP', value: 'cep' },
		{ label: 'País', value: 'country' },
		{ label: 'Número', value: 'number' },
		{ label: 'Logradouro', value: 'street' },
		{ label: 'Complemento', value: 'complement' },
		{ label: 'Estado', value: 'state' },
		{ label: 'Bairro', value: 'district' },
		{ label: 'Cidade', value: 'city' },
	]

	return (
		<Widget
			{...props}
			type={'Endereço'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} hasDescription={false} />

					<FormItem label="Campos">
						<Select
							mode="multiple"
							allowClear={true}
							searchValue=""
							value={[...data.fields].sort(
								(a, b) =>
									fieldOptions.findIndex((o) => o.value === a) -
									fieldOptions.findIndex((o) => o.value === b)
							)}
							onChange={(v) => update({ fields: v })}>
							{fieldOptions.map(({ label, value }, key) => (
								<Select.Option key={key} value={value}>
									{label}
								</Select.Option>
							))}
						</Select>
					</FormItem>
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(EnvironmentOutlined)

AddressWidget.propTypes = {
	data: object,
}
