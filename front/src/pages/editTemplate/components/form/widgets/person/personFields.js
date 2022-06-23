import React from 'react'
import { bool, func, object } from 'prop-types'
import {
	CollapseFields,
	FormItemFields,
	HeaderFieldsTitle,
	PanelWrapper,
	ValidateCollapseFields,
} from '../base/styles'

import { Checkbox, Collapse, Input, Switch } from 'antd'

const PersonFields = ({
	data,
	onChangeSwitch,
	onChangeCheckBox,
	selected,
	update,
	validInput,
}) => {
	const { label, personType, fields } = data

	return (
		<ValidateCollapseFields ghost defaultActiveKey={[1]}>
			<Collapse.Panel
				key={0}
				header={<HeaderFieldsTitle>{label}</HeaderFieldsTitle>}
				extra={
					<div onClick={(e) => e.stopPropagation()}>
						{personType ? (
							<Switch
								style={{ backgroundColor: !validInput && '#ff9999' }}
								checked={selected.person_type.includes(personType)}
								onChange={(e) => onChangeSwitch(e, data)}
							/>
						) : (
							<Switch
								checked={fields?.some((f1) =>
									f1?.fields?.some((f2) => selected.fields.includes(f2.field))
								)}
								onChange={(e) => onChangeSwitch(e, data)}
							/>
						)}
					</div>
				}>
				<div style={{ marginTop: 24 }}>
					{label !== 'Endereço' ? (
						fields.map((field) => (
							<CollapseFields ghost defaultActiveKey={[1]} key={field.title}>
								<Collapse.Panel
									header={<HeaderFieldsTitle>{field.title}</HeaderFieldsTitle>}
									extra={
										<div onClick={(e) => e.stopPropagation()}>
											<Checkbox
												checked={field.fields.every(
													(f) =>
														selected.fields.includes(f.field) &&
														(!personType ||
															selected.person_type.includes(personType))
												)}
												onChange={(e) =>
													onChangeCheckBox(e.target.checked, field.fields, data)
												}></Checkbox>
										</div>
									}>
									<PanelWrapper>
										{field.fields.map((f) => (
											<FormItemFields
												key={f.label}
												label={f.label}
												$flex={f.flex}>
												<Input
													onBlur={(e) =>
														update({
															initialValue: {
																...selected.initialValue,
																[f.field]: e.target.value,
															},
														})
													}
													defaultValue={
														selected.initialValue
															? selected.initialValue[f.field]
															: undefined
													}
													placeholder="Valor inicial"
												/>
											</FormItemFields>
										))}
									</PanelWrapper>
								</Collapse.Panel>
							</CollapseFields>
						))
					) : (
						<PanelWrapper>
							{fields[0].fields.map((f) => (
								<FormItemFields key={f.label} label={f.label} $flex={f.flex}>
									<Input
										onBlur={(e) =>
											update({
												initialValue: {
													...selected.initialValue,
													[f.field]: e.target.value,
												},
											})
										}
										defaultValue={
											selected.initialValue
												? selected.initialValue[f.field]
												: undefined
										}
										placeholder="Valor inicial"
									/>
								</FormItemFields>
							))}
						</PanelWrapper>
					)}
				</div>
			</Collapse.Panel>
		</ValidateCollapseFields>
	)
}

export default PersonFields

PersonFields.propTypes = {
	data: object,
	onChangeSwitch: func,
	onChangeCheckBox: func,
	selected: object,
	update: func,
	validInput: bool,
}
