import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'
import { ProfileOutlined } from '@ant-design/icons'

import { useUpdate, useValidation, Widget } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { styleIconValidation } from './base/styles'

import StructuredFields from './structuredList/structuredFields'
import StructuredFormatted from './structuredList/structuredFormatted'

export const StructuredListWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)
	const [validStructure, setValidStructure] = useState(true)
	const [validWidget, setValidWidget] = useState(false)

	useEffect(() => {
		setValid(validStructure && validWidget)
	}, [setValid, validStructure, validWidget])

	return (
		<Widget
			{...props}
			type={'Lista Estruturada'}
			icon={<Icon $error={!valid} />}
			onValidate={setValidWidget}
			formItems={
				<div>
					<CommonFields data={data} update={update} hasDescription={false} />
					<StructuredFields
						{...props}
						update={update}
						onValidate={setValidStructure}
					/>
					<StructuredFormatted data={data} update={update} />
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(ProfileOutlined)

StructuredListWidget.propTypes = {
	data: object,
}
