import React from 'react'
import { object } from 'prop-types'
import { Form, InputNumber } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import ImageUpload from 'components/imageUpload'
import { validateNumber } from 'utils'

import { useUpdate, useValidation, Widget } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation } from './base/styles'

export const ImageWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)

	return (
		<Widget
			{...props}
			type={'Upload de imagem'}
			icon={<Icon $error={!valid} />}
			onValidate={setValid}
			displayStyles={null}
			formItems={
				<div>
					<CommonFields data={data} update={update} />

					<FormItem label="Valor inicial">
						<StyledImageUpload
							initialValue={data.initialValue}
							onChange={(v) => update({ initialValue: v ?? '' })}
						/>
					</FormItem>
				</div>
			}
			variableItems={
				<StyledFormItem label="Largura">
					<InputNumber
						defaultValue={data.variable.width}
						onBlur={(e) =>
							update({
								variable: {
									...data.variable,
									width: validateNumber(e.target.value, 0),
								},
							})
						}
						formatter={(value) => `${value} cm`}
						parser={(value) => value.replace(/[^0-9]*/g, '') || 1}
						min={1}
						style={{ width: '100%' }}
					/>
				</StyledFormItem>
			}
		/>
	)
})

const StyledFormItem = styled(Form.Item)`
	width: 45%;
	margin-bottom: 0px;

	.ant-form-item-label {
		padding: 0;
		margin-left: 16px;
	}
`

const StyledImageUpload = styled(ImageUpload)`
	margin-right: -8px;

	&& .ant-upload-list-picture-card-container,
	&& .ant-upload-select-picture-card {
		width: 101px;
		height: 101px;
	}
`

const Icon = styleIconValidation(FileImageOutlined)

ImageWidget.propTypes = {
	data: object,
}
