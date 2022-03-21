import React, { useState } from 'react'
import { object, number, func } from 'prop-types'
import { Input } from 'antd'
import { FontSizeOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import { Field, useUpdate } from './fieldBase'
import { FormItem } from './styles'

const TextField = (props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useState(false)

	return (
		<Field
			{...props}
			type={'Texto'}
			icon={<Icon $error={!valid} />}
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

					<FormItem label="Placeholder" $labelWidth={'17%'}>
						<Input
							onBlur={(e) => update({ placeholder: e.target.value })}
							defaultValue={data.placeholder}
							autoComplete="off"
						/>
					</FormItem>

					<FormItem label="Valor inicial" $labelWidth={'17%'}>
						<Input.TextArea
							onBlur={(e) => update({ initialValue: e.target.value })}
							defaultValue={data.initialValue}
							autoComplete="off"
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
}

export default TextField

TextField.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}

const Icon = styled(FontSizeOutlined)`
	user-select: none;
	font-size: 24px;
	color: ${(props) => (props.$error ? '#ff4d4f' : '#52c41a')};
`
