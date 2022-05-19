import React, { useEffect } from 'react'
import { object, number, func } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { ShopOutlined } from '@ant-design/icons'
import { Select } from 'antd'

import { Widget, useUpdate, useValidation } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'
import { getCnaeField } from 'states/modules/cnaeField'

export const CnaeWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getCnaeField())
	}, [dispatch])

	const cnaeDescription = useSelector(({ cnaeField }) =>
		Array.isArray(cnaeField?.data)
			? cnaeField.data.map((cnae) => cnae.descricao)
			: []
	)

	return (
		<Widget
			{...props}
			type={'CNAE'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			formItems={
				<div>
					<CommonFields data={data} update={update} />
					<FormItem label="Valor inicial">
						<Select
							showSearch={true}
							allowClear={true}
							value={data.initialValue}
							onChange={(v) => update({ initialValue: v })}>
							{cnaeDescription.map((option, index) => (
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

const Icon = styleIconValidation(ShopOutlined)

CnaeWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
