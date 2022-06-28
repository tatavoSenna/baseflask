import { Form, Select, Typography } from 'antd'
import { string, shape, object, func, bool } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filterText } from 'services/filter'
import { getDatabaseTexts } from 'states/modules/internalDatabasesField'
import styled from 'styled-components'
import { DeleteOutlined } from '@ant-design/icons'
import InfoField from 'components/infoField'

const { Paragraph } = Typography

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

	const database = useSelector(
		({ internalDatabaseField }) => internalDatabaseField
	)
	const dataItem = database.data[databaseId]

	const [values, setValues] = useState(inputValue ?? [])

	useEffect(() => {
		dispatch(getDatabaseTexts({ id: databaseId }))
	}, [dispatch, databaseId])

	const handleChangeSelect = (e) => {
		let exist = 0
		values.forEach((val) => {
			if (val === e) {
				exist = 1
			}
		})
		if (exist === 0) {
			setValues([...values, e])
			onChange(values)
		}
	}

	const handleDeleteSelectedText = (e) => {
		setValues(values.filter((item) => item !== e))
	}

	useEffect(() => {
		if (form !== undefined) {
			form.setFieldsValue({
				[name]: values,
			})
		}
	}, [form, name, values])

	const dataItemExist = dataItem !== undefined

	// removing selected options
	const options =
		dataItem?.texts?.filter((item) => !values.includes(item.id)) ?? []

	const notFoundContentText = !dataItemExist
		? 'Nenhum dado encontrado'
		: dataItem?.loading
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
				{values.length > 0 &&
					values.map(
						(i) =>
							dataItemExist &&
							dataItem?.texts && (
								<TextSelected key={i}>
									<TextTitle>
										{dataItem?.texts?.find((item) => item.id === i).description}
									</TextTitle>
									<DeleteOutlined
										style={{ height: '100%', color: '#1890FF', fontSize: 20 }}
										onClick={() => handleDeleteSelectedText(i)}
									/>
								</TextSelected>
							)
					)}
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
`

const TextTitle = styled(Paragraph)`
	width: 90%;
	margin: 0 !important;

	font-size: 16px;
`
