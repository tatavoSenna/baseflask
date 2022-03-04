import React, { useState, useEffect } from 'react'
import { object, func, number } from 'prop-types'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/pt'
import { FieldCard } from './fieldCard'
import { FormItem } from './styles'
import styled from 'styled-components'

const JSONField = (props) => {
	const { data, pageIndex, fieldIndex, updateFormInfo } = props
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(false)
	}, [fieldIndex])

	return (
		<FieldCard
			{...props}
			type={data.type || 'JSON'}
			icon={<Icon $error={error}>{'{}'}</Icon>}>
			<FormItem
				name={`field_${pageIndex}_${fieldIndex}`}
				style={{ marginBottom: '0px', cursor: 'text' }}>
				<JSONInput
					id={`json_${pageIndex}_${fieldIndex}`}
					onBlur={(e) => {
						try {
							updateFormInfo(JSON.parse(e.json), 'field', pageIndex, fieldIndex)
							setError(false)
						} catch {
							setError(true)
						}
					}}
					onChange={(e) => {
						try {
							JSON.parse(e.json)
							setError(false)
						} catch {
							setError(true)
						}
					}}
					waitAfterKeyPress={250}
					placeholder={data}
					locale={locale}
					confirmGood={false}
					theme="light_mitsuketa_tribute"
					height="100%"
					width="100%"
				/>
			</FormItem>
		</FieldCard>
	)
}
export default JSONField

JSONField.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}

const Icon = styled.h1`
	user-select: none;
	font-size: 24px;
	font-family: monospace;
	font-weight: bold;
	margin: -12px 0px -10px 0px;
	color: ${(props) => (props.$error ? '#ff4d4f' : '#52c41a')};
`
