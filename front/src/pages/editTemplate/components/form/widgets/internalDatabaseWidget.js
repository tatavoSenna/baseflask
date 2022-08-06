import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { DatabaseOutlined } from '@ant-design/icons'

import { useUpdate, useValidation, Widget } from './base/widget'
import { CommonFields } from './base/widgetCommonFields'
import { FormItem, styleIconValidation, ValidatedSelect } from './base/styles'
import { object } from 'prop-types'
import { listAllDatabases, listTags } from 'states/modules/databases'

export const InternalDatabaseWidget = React.memo((props) => {
	const { data } = props
	const database = useSelector(({ database }) => database)
	const dataItems = database.data
	const dataTags = database.tags.data

	const dispatch = useDispatch()

	const update = useUpdate(props)
	const [valid, setValid] = useValidation(props)
	const [databaseValid, setDatabaseValid] = useState(false)
	const [widget, setWidget] = useState(false)

	useEffect(() => {
		dispatch(listAllDatabases())
	}, [dispatch])

	useEffect(() => {
		dispatch(listTags({ perPage: 8 }))
	}, [dispatch])

	useEffect(() => {
		setDatabaseValid(dataItems ? dataItems.length > 0 : false)

		setValid(databaseValid && widget)
	}, [databaseValid, widget, setValid, dataItems])

	const handleSearch = (value) => {
		dispatch(listTags({ perPage: 8, search: value }))
	}

	return (
		<Widget
			{...props}
			type={'Banco de dados'}
			icon={<Icon $error={!valid} />}
			onValidate={setWidget}
			formItems={
				<div>
					<CommonFields data={data} update={update} hasDescription={false} />

					<FormItem label="Banco de dados" $labelWidth="fit-content">
						<ValidatedSelect
							$error={!databaseValid}
							$placeholderError={!databaseValid}
							value={data.databaseId === '' ? undefined : data.databaseId}
							onChange={(v) => update({ databaseId: v })}
							placeholder={
								databaseValid
									? 'Selecione um banco de dados'
									: 'Nenhum banco de dados encontrado'
							}>
							{dataItems
								? dataItems.map((item, i) => (
										<Select.Option key={i} value={item.id}>
											{item.title}
										</Select.Option>
								  ))
								: null}
						</ValidatedSelect>
					</FormItem>
					<FormItem label="Filtros" $labelWidth="fit-content">
						<ValidatedSelect
							mode="multiple"
							value={data.filter === '' ? undefined : data.filter}
							onChange={(v) => update({ filter: v })}
							onSearch={handleSearch}
							filterOption={false}
							loading={database.tags.loading}
							notFoundContent={
								database.tags.loading
									? 'Carregando...'
									: 'Nenhum item encontrado'
							}>
							{dataTags
								? dataTags.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.title}
										</Select.Option>
								  ))
								: null}
						</ValidatedSelect>
					</FormItem>
				</div>
			}
		/>
	)
})

const Icon = styleIconValidation(DatabaseOutlined)

InternalDatabaseWidget.propTypes = {
	data: object,
}
