import { Collapse, Input, Form, Tag } from 'antd'
import { func, object } from 'prop-types'
import React, { useState } from 'react'

import styled from 'styled-components'

const StructuredFormatted = ({ data, update }) => {
	const { structure, variable } = data
	const { row_template, separator } = variable.extra_style_params

	const variablesList = structure.reduce((a, item) => {
		if (item.variable.name) a.push(item.variable.name)
		return a
	}, [])

	const [syncValue, setSyncValue] = useState(row_template)

	const handleVariableInText = (nVar) => {
		let newValue = `${syncValue} {{ ${nVar} }}`
		setSyncValue(newValue)
		updateVariable(newValue)
	}

	const handleStateOnChange = (e) => {
		setSyncValue(e.target.value)
	}

	const hangleOnBlur = () => {
		updateVariable(syncValue)
	}

	const updateVariable = (nVar) => {
		update({
			variable: {
				...variable,
				extra_style_params: {
					...variable.extra_style_params,
					row_template: nVar,
				},
			},
		})
	}

	const updateSeparator = (e) => {
		update({
			variable: {
				...variable,
				extra_style_params: {
					...variable.extra_style_params,
					separator: e.target.value,
				},
			},
		})
	}

	return (
		<CollapseFields ghost defaultActiveKey={[1]}>
			<PanelCollapse key={0} header={<div>Formatação</div>}>
				<PanelWrapper>
					{variablesList.length > 0 && (
						<FormItemFields label="Variáveis adicionadas">
							<VariablesWrapper>
								{variablesList.map((item) => (
									<Variables onClick={() => handleVariableInText(item)}>
										{item}
									</Variables>
								))}
							</VariablesWrapper>
						</FormItemFields>
					)}

					<FormItemFields label="Texto">
						<Input.TextArea
							value={syncValue}
							onBlur={hangleOnBlur}
							onChange={handleStateOnChange}
						/>
					</FormItemFields>
					<FormItemFields label="Separador">
						<Input
							style={{ width: '50%' }}
							defaultValue={separator}
							onBlur={updateSeparator}
						/>
					</FormItemFields>
				</PanelWrapper>
			</PanelCollapse>
		</CollapseFields>
	)
}

StructuredFormatted.propTypes = {
	data: object,
	update: func,
}

export default StructuredFormatted

const VariablesWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	border-radius: 2px;
	gap: 4px;
`

const Variables = styled(Tag)`
	font-size: 14px;
	cursor: pointer;
`

const CollapseFields = styled(Collapse)`
	border: 1px solid #d9d9d9;
	margin-bottom: 24px;
`

const PanelCollapse = styled(Collapse.Panel)`
	&& .ant-collapse-header {
		align-items: center;
		display: flex;
	}

	&&& .ant-collapse-content-box {
		padding: 20px 32px;
	}
`

const PanelWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	column-gap: 12px;
`

const FormItemFields = styled(Form.Item)`
	flex-direction: column;
	flex: ${({ $flex = '1 0 100%' }) => $flex};

	.ant-form-item-label {
		width: 100%;
		text-align: left;
	}
`
