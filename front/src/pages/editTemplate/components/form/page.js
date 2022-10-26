import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { object, array, number, func } from 'prop-types'
import { Form, Input, Empty } from 'antd'
import Delete from '~/components/deleteConfirm'
import { editTemplateFormInfo } from '~/states/modules/editTemplate'

import { widgets } from './widgets'
import { JSONWidget } from './widgets/jsonWidget'
import {
	editTemplateFieldRemove,
	editTemplateFieldValid,
} from 'states/modules/editTemplate'

const Page = ({ pageIndex, data, variables, handleRemovePage }) => {
	const dispatch = useDispatch()

	const handleUpdateTitle = useCallback(
		(value, pageIndex, fieldIndex) => {
			dispatch(
				editTemplateFormInfo({ value, name: 'title', pageIndex, fieldIndex })
			)
		},
		[dispatch]
	)

	const handleRemoveField = useCallback(
		(pageIndex, fieldIndex) => {
			dispatch(editTemplateFieldRemove({ pageIndex, fieldIndex }))
		},
		[dispatch]
	)

	const handleUpdateField = useCallback(
		(value, pageIndex, fieldIndex) => {
			dispatch(
				editTemplateFormInfo({ value, name: 'field', pageIndex, fieldIndex })
			)
		},
		[dispatch]
	)

	const handleVadidationField = useCallback(
		(value, pageIndex, fieldIndex) => {
			dispatch(editTemplateFieldValid({ value, pageIndex, fieldIndex }))
		},
		[dispatch]
	)

	return (
		<div
			style={{
				height: '100%',
				border: '2px solid #F0F0F0',
				padding: 20,
			}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
					gap: 20,
				}}>
				<Form.Item
					name={`title_${pageIndex}`}
					label="Título"
					style={{
						display: 'flex',
						margin: '0 0 8px 0',
						width: '100%',
						alignItems: 'center',
					}}
					onChange={(e) => handleUpdateTitle(e.target.value, pageIndex)}
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
					<Input autoFocus value={data.title} />
				</Form.Item>
				<Delete
					title="Deseja excluir esse esse conjunto de campos?"
					handle={() => handleRemovePage(pageIndex)}
				/>
			</div>
			{!data.fields.length ? (
				<Empty description="Sem Campos" style={{ marginBottom: '1rem' }} />
			) : (
				<div
					style={{
						overflowY: 'scroll',
						height: 'calc(100% - 65px)',
						marginTop: 10,
						padding: '0 10px 0 0',
					}}>
					{data.fields.map((field, fieldIndex) => {
						const el = field?.type in widgets ? widgets[field.type] : JSONWidget
						const props = {
							key: data.ids[fieldIndex],
							data: field,
							variables,
							pageIndex,
							fieldIndex,
							onUpdate: handleUpdateField,
							onRemove: handleRemoveField,
							onValidate: handleVadidationField,
							valid: data.valid[fieldIndex],
						}

						return React.createElement(el, props)
					})}
				</div>
			)}
		</div>
	)
}

export default Page

Page.propTypes = {
	data: object,
	variables: array,
	pageIndex: number,
	handleRemovePage: func,
}
