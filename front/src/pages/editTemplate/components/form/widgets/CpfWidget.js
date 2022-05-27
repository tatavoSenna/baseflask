import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'
import { IdcardOutlined } from '@ant-design/icons'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import {
	FormItem,
	styleIconValidation,
	ValidatedMaskedInput,
} from './base/styles'
import { validateCPF } from 'utils'

export const CpfWidget = React.memo((props) => {
	const { data } = props

	const isValidCpf = (value) => !value || validateCPF(value)

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)
	const [validCpf, setValidCpf] = useState(isValidCpf(data.initialValue))
	const [validWidget, setValidWidget] = useState(false)

	useEffect(() => {
		setValid(validCpf && validWidget)
	}, [setValid, validCpf, validWidget])

	return (
		<Widget
			{...props}
			icon={<Icon $error={!valid} />}
			onValidate={setValidWidget}
			type={'CPF'}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<FormItem label="Valor inicial" $width={'50%'}>
						<ValidatedMaskedInput
							$error={!validCpf}
							onBlur={(e) => {
								setValidCpf(isValidCpf(e.target.value))
								return update({ initialValue: e.target.value })
							}}
							defaultValue={data.initialValue}
							mask="111.111.111-11"
						/>
					</FormItem>
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(IdcardOutlined)

CpfWidget.propTypes = {
	data: object,
}
