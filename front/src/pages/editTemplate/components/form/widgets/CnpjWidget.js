import React from 'react'
import { object } from 'prop-types'
import { CreditCardOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import {
	FormItem,
	styleIconValidation,
	ValidatedMaskedInput,
} from './base/styles'

export const CnpjWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			type={'CNPJ'}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<FormItem label="Valor inicial" $width={'50%'}>
						<ValidatedMaskedInput
							onBlur={(e) => update({ initialValue: e.target.value })}
							defaultValue={data.initialValue}
							mask="11.111.111/1111-11"
						/>
					</FormItem>
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(CreditCardOutlined)

CnpjWidget.propTypes = {
	data: object,
}
