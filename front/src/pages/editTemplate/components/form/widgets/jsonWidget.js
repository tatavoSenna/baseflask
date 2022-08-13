import React, { useState, useEffect } from 'react'
import { object, func, number } from 'prop-types'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/pt'

import { Widget, useValidation } from './base/widget'
import { FormItem, TextIcon } from './base/styles'

export const JSONWidget = React.memo((props) => {
	const { data, pageIndex, fieldIndex, onUpdate } = props
	const [error, setError] = useState(false)
	const [valid, setValid] = useValidation(props)

	useEffect(() => {
		setError(false)
	}, [fieldIndex])

	return (
		<Widget
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
					style={{ marginBottom: '0px', cursor: 'text' }}>
					<JSONInput
						id={`json_${pageIndex}_${fieldIndex}`}
						onBlur={(e) => {
							try {
								onUpdate(JSON.parse(e.json), pageIndex, fieldIndex)
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
})

JSONWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	onUpdate: func,
}
