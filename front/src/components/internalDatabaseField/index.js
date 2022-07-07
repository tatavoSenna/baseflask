import React, { useEffect, useState } from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import { Form, Select, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import { getDatabaseTexts } from 'states/modules/internalDatabasesField'
import { filterText } from 'services/filter'
import InfoField from 'components/infoField'

const { Paragraph } = Typography

const SortableElement = sortableElement(({ children }) => children)
const SortableContainer = sortableContainer(({ children }) => (
	<div>{children}</div>
))

const InternalDatabaseField = ({
	pageFieldsData,
	inputValue,
	disabled,
	onChange,
	form,
	visible,
	className,
	first,
}) => {
	const dispatch = useDispatch()
	const { databaseId, variable, type, id, list, label, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const [values, setValues] = useState(inputValue || [])

	const dataItem = useSelector(
		({ internalDatabaseField }) => internalDatabaseField.data[databaseId]
	)

	useEffect(() => {
		dispatch(getDatabaseTexts({ id: databaseId }))
	}, [dispatch, databaseId])

	useEffect(() => {
		if (form !== undefined) {
			form.setFieldsValue({
				[name]: values,
			})
		}
	}, [form, name, values])

	const handleChangeSelect = (e) => {
		setValues([...values, e])
		onChange(values)
	}

	const handleDeleteSelectedText = (e) => {
		setValues(values.filter((item) => item !== e))
	}

	const handleSort = ({ oldIndex, newIndex }) => {
		let newValues = [...values]
		newValues.splice(newIndex, 0, newValues.splice(oldIndex, 1)[0])

		setValues(newValues)
	}

	const options =
		dataItem?.texts?.filter((item) => !values.includes(item.id)) ?? [] // filter selected options

	const selectedItems =
		(dataItem?.texts &&
			values.map((id) => dataItem.texts.find((x) => x.id === id))) ||
		[]

	const notFoundContentText =
		dataItem === undefined
			? 'Nenhum dado encontrado'
			: dataItem.loading
			? 'Dados sendo carregados'
			: 'Todos os dados foram ultilizados'

	return (
		<Form.Item
			key={name}
			style={{ width: '100%' }}
			type={type}
			className={className}
			label={<InfoField label={label} />}
			name={list !== undefined ? [list, name] : name}
			initialValue={values}
			rules={
				visible && [
					() => ({
						validator(rule, value) {
							if (optional) return Promise.resolve()
							else if (value.length === 0)
								return Promise.reject('Este campo é obrigatório.')
							return Promise.resolve()
						},
					}),
				]
			}
			colon={false}>
			<>
				<SortableContainer onSortEnd={handleSort} distance={15}>
					{selectedItems.map(({ id, description }, index) => (
						<SortableElement key={id} index={index}>
							<TextSelected>
								<TextTitle>{description}</TextTitle>
								<DeleteOutlined
									style={{ height: '100%', color: '#1890FF', fontSize: 20 }}
									onClick={() => handleDeleteSelectedText(id)}
								/>
							</TextSelected>
						</SortableElement>
					))}
				</SortableContainer>

				<Select
					showSearch
					value={null}
					disabled={disabled}
					showArrow={false}
					filterOption={filterText}
					placeholder="Adicionar Texto"
					onChange={handleChangeSelect}
					autoFocus={first}
					notFoundContent={notFoundContentText}>
					{options.map((item, i) => (
						<Select.Option key={i} value={item.id}>
							{item.description}
						</Select.Option>
					))}
				</Select>
			</>
		</Form.Item>
	)
}

InternalDatabaseField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
	}).isRequired,
	className: string,
	onChange: func,
	first: bool,
	inputValue: string,
	disabled: bool,
	visible: bool,
	form: object,
}

export default InternalDatabaseField

const TextSelected = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border: 1px solid #d9d9d9;
	padding: 20px;
	margin-bottom: 15px;
	background: white;
`

const TextTitle = styled(Paragraph)`
	width: 90%;
	margin: 0 !important;

	font-size: 16px;
`
