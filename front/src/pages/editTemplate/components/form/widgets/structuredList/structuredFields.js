import React, { useEffect, useState } from 'react'
import { Collapse, Badge, Button, Dropdown, Menu } from 'antd'

import styled from 'styled-components'
import { array, func, number, object } from 'prop-types'
import { fieldStructure } from '../../fieldStructure'
import { widgets } from '../index'
import { JSONWidget } from '../jsonWidget'

const StructuredFieldsWrapper = ({ children, num, update, structure }) => {
	const fieldTypes = (
		<Menu onClick={(value) => handleAddField(value.key)}>
			<Menu.Item key="text">Texto</Menu.Item>
			<Menu.Item key="text_area">Parágrafo</Menu.Item>
			<Menu.Item key="number">Número</Menu.Item>
			<Menu.Item key="cpf">CPF</Menu.Item>
			<Menu.Item key="cnpj">CNPJ</Menu.Item>
			<Menu.Item key="email">Email</Menu.Item>
			<Menu.Item key="date">Data</Menu.Item>
			<Menu.Item key="time">Hora</Menu.Item>
			<Menu.Item key="currency">Moeda</Menu.Item>
			<Menu.Item key="bank">Banco</Menu.Item>
			<Menu.Item key="cnae">CNAE</Menu.Item>
			<Menu.Item key="dropdown">Dropdown</Menu.Item>
			<Menu.Item key="radio">Rádio</Menu.Item>
			<Menu.Item key="checkbox">Checkbox</Menu.Item>
			<Menu.Item key="variable_image">Upload de imagem</Menu.Item>
		</Menu>
	)

	const handleAddField = (type) => {
		const newField = fieldStructure(type)

		update({
			structure: [...structure, newField],
		})
	}

	return (
		<CollapseFields ghost defaultActiveKey={[1]}>
			<PanelCollapse
				key={0}
				header={<HeaderFieldsTitle>Campos</HeaderFieldsTitle>}
				extra={
					<Badge
						style={{
							backgroundColor: '#1890ff',
						}}
						count={num}
						showZero={num === 0}
					/>
				}>
				{children}
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Dropdown overlay={fieldTypes} trigger="click">
						<Button type="primary">Adicionar campo</Button>
					</Dropdown>
				</div>
			</PanelCollapse>
		</CollapseFields>
	)
}

const StructuredFields = ({ data, update, onValidate, ...props }) => {
	const { structure } = data

	const [validFields, setValidFields] = useState([])

	useEffect(() => {
		if (structure.length > validFields.length) {
			setValidFields([
				...validFields,
				...Array(structure.length - validFields.length).fill(true),
			])
		}
	}, [structure, setValidFields, validFields])

	useEffect(() => {
		onValidate(validFields.every((item) => item))
	}, [onValidate, validFields])

	const handleValidate = (value, pageIndex, fieldIndex) => {
		let temp = [...validFields]
		temp[fieldIndex] = value

		setValidFields(temp)
	}

	const handleDelete = (pageIndex, fieldIndex) => {
		let newStructure = structure.filter((item, i) => i !== fieldIndex)

		const temp = validFields.filter((item, i) => i !== fieldIndex)
		setValidFields(temp)

		update({ structure: newStructure })
	}

	const handleUpdate = (value, pageIndex, fieldIndex) => {
		let structureList = [...structure]
		structureList[fieldIndex] = value

		update({ structure: structureList })
	}

	return (
		<StructuredFieldsWrapper
			num={structure.length}
			update={update}
			structure={structure}>
			{structure.map((field, index) => {
				const el = field?.type in widgets ? widgets[field.type] : JSONWidget

				const prop = {
					...props,
					key: index,
					data: field,
					compact: true,
					fieldIndex: index,
					valid: validFields[index],

					onUpdate: handleUpdate,
					onRemove: handleDelete,
					onValidate: handleValidate,
				}

				return React.createElement(el, prop)
			})}
		</StructuredFieldsWrapper>
	)
}

export default StructuredFields

StructuredFields.propTypes = {
	data: object,
	update: func,
	onValidate: func,
}

StructuredFieldsWrapper.propTypes = {
	children: object,
	num: number,
	update: func,
	structure: array,
}

const PanelCollapse = styled(Collapse.Panel)`
	&& .ant-collapse-header {
		align-items: center;
		display: flex;
	}

	&&& .ant-collapse-content-box {
		padding: 20px 32px;
	}
`

const HeaderFieldsTitle = styled.p`
	display: flex;
	width: 100%;
	margin: 0;
`

const CollapseFields = styled(Collapse)`
	border: 1px solid #d9d9d9;
	margin-bottom: 24px;
`
