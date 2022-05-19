import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'
import { CreditCardOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import {
	FormItem,
	styleIconValidation,
	ValidatedMaskedInput,
} from './base/styles'
import { validateCNPJ } from 'utils'

export const CnpjWidget = React.memo((props) => {
	const { data } = props

	const isValidCnpj = (value) => validateCNPJ(value) || value === ''

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)
	const [cnpjValue, setCnpjValue] = useState(isValidCnpj(data.initialValue))
	const [validWidget, setValidWidget] = useState(false)

	useEffect(() => {
		setValid(cnpjValue && validWidget)
	}, [setValid, cnpjValue, validWidget])

	return (
		<Widget
			{...props}
			icon={<Icon $error={!valid} />}
			onValidate={setValidWidget}
			type={'CNPJ'}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<FormItem label="Valor inicial" $width={'50%'}>
						<ValidatedMaskedInput
							$error={!cnpjValue}
							onBlur={(e) => {
								setCnpjValue(isValidCnpj(e.target.value))
								return update({ initialValue: e.target.value })
							}}
							defaultValue={data.initialValue}
							mask="11.111.111/1111-11"
						/>
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

const Icon = styleIconValidation(CreditCardOutlined)

CnpjWidget.propTypes = {
	data: object,
}
