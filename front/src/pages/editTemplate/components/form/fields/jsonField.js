import React, { useState, useEffect } from 'react'
import { object, func, number } from 'prop-types'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/pt'
import { Field } from './fieldBase'
import { FormItem, TextIcon } from './styles'

const JSONField = (props) => {
	const { data, pageIndex, fieldIndex, updateFormInfo } = props
	const [error, setError] = useState(false)
	const [valid, setValid] = useState(false)

	useEffect(() => {
		setError(false)
	}, [fieldIndex])

	return (
		<Field
			{...props}
			type={data.type || 'JSON'}
			icon={<TextIcon $error={error || !valid}>{'{}'}</TextIcon>}
			variableItems={false}
			showConditions={false}
			displayStyles={[]}
			onValidate={setValid}
			formItems={
				<FormItem
					name={`field_${pageIndex}_${fieldIndex}`}
					style={{ marginBottom: '0px', cursor: 'text' }}
				>
					<JSONInput
						id={`json_${pageIndex}_${fieldIndex}`}
						onBlur={(e) => {
							try {
								updateFormInfo(
									JSON.parse(e.json),
									'field',
									pageIndex,
									fieldIndex
								)
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
			}
		/>
	)
}
export default JSONField

JSONField.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
