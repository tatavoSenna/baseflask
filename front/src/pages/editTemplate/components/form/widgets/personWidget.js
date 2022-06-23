import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'
import { useUpdate, useValidation, Widget } from './base/widget'
import { styleIconValidation, ThinDivider } from './base/styles'
import { UserOutlined } from '@ant-design/icons'
import { CommonFields } from './base/widgetCommonFields'
import { fieldsTypes } from './person/personFieldsTypes'
import PersonFields from './person/personFields'

export const PersonWidget = React.memo((props) => {
	const { data } = props

	const update = useUpdate(props)

	const [valid, setValid] = useValidation(props)
	const [validInput, setValidInput] = useState(true)
	const [validWidget, setValidWidget] = useState(false)

	useEffect(() => {
		if (data.person_type.length > 0) {
			setValidInput(true)
		} else {
			setValidInput(false)
		}

		setValid(validInput && validWidget)
	}, [data.person_type, validInput, setValid, validWidget])

	const toggleFields = (checked, fields, dataGroup) => {
		let checkedFields = [...data.fields]
		let validFields = fields.map((f) => f.field)

		if (checked) {
			validFields.forEach((element) => {
				if (!checkedFields.includes(element)) {
					checkedFields.push(element)
				}
			})
		} else {
			checkedFields = checkedFields.filter((f) => !validFields.includes(f))
		}

		let allGroupFields = dataGroup.fields.reduce(
			(a, item) => [...a, ...item.fields.map((d) => d.field)],
			[]
		)

		if (dataGroup.personType !== undefined) {
			let newPersonType = [...data.person_type]
			if (checked) {
				if (!newPersonType.includes(dataGroup.personType)) {
					newPersonType.push(dataGroup.personType)
				}
			} else {
				let activePersonType = allGroupFields.some((f) =>
					checkedFields.includes(f)
				)
				if (!activePersonType) {
					newPersonType = data.person_type.filter(
						(f) => f !== dataGroup.personType
					)
				}
			}
			return update({
				fields: checkedFields,
				person_type: newPersonType,
			})
		}

		update({ fields: checkedFields })
	}

	const handleCheckBox = (checked, fields, dataGroup) => {
		toggleFields(checked, fields, dataGroup)
	}

	const handleSwitch = (checked, dataGroup) => {
		let allGroupFields = dataGroup.fields.reduce(
			(a, item) => [...a, ...item.fields],
			[]
		)

		handleCheckBox(checked, allGroupFields, dataGroup)
	}

	return (
		<Widget
			{...props}
			type={'Pessoa'}
			icon={<Icon $error={!valid} />}
			onValidate={setValidWidget}
			formItems={
				<div>
					<CommonFields data={data} update={update} hasDescription={false} />
					<ThinDivider $noTopMargin orientation="left">
						Capos
					</ThinDivider>
					{fieldsTypes.map((fields, key) => (
						<PersonFields
							key={key}
							data={fields}
							onChangeCheckBox={handleCheckBox}
							onChangeSwitch={handleSwitch}
							update={update}
							selected={data}
							validInput={validInput}
						/>
					))}
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(UserOutlined)

PersonWidget.propTypes = {
	data: object,
}
