import React from 'react'
import { useDispatch } from 'react-redux'
import { object, number, func } from 'prop-types'
import { Card, Form, Input, Button, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Delete from '~/components/deleteConfirm'

import {
	postTemplateFieldAdd,
	postTemplateFormInfo,
} from '~/states/modules/postTemplate'

import Field from './field'

const Page = ({ pageIndex, data, handleRemovePage }) => {
	const dispatch = useDispatch()

	const handleAddField = () => {
		const newField = {
			type: '',
			label: '',
			value: '',
			variable: '',
		}

		dispatch(postTemplateFieldAdd({ newField, pageIndex }))
	}

	const updateFormInfo = (value, name, pageIndex, fieldIndex) => {
		dispatch(postTemplateFormInfo({ value, name, pageIndex, fieldIndex }))
	}

	return (
		<Card
			style={{ marginBottom: '1rem', marginTop: '2rem', maxWidth: '40rem' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Form.Item
					name={`title_${pageIndex}`}
					label="Título"
					style={{ width: '50%', marginLeft: '8px' }}
					onChange={(e) => updateFormInfo(e.target.value, 'title', pageIndex)}
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
					<Input value={data.title} />
				</Form.Item>
				<Button>
					<Delete
						title="Deseja excluir esse esse conjunto de campos?"
						handle={() => handleRemovePage(pageIndex)}
					/>
				</Button>
			</div>
			{!data.fields.length ? (
				<Empty description="Sem Campos" style={{ marginBottom: '1rem' }} />
			) : (
				data.fields.map((field, fieldIndex) => (
					<Field
						key={fieldIndex}
						data={field}
						pageIndex={pageIndex}
						fieldIndex={fieldIndex}
						updateFormInfo={updateFormInfo}
					/>
				))
			)}
			<Button
				onClick={() => handleAddField()}
				type="primary"
				icon={<PlusOutlined />}
				style={{
					display: 'inline-block',
					float: 'right',
				}}>
				Novo Campo
			</Button>
		</Card>
	)
}

export default Page

Page.propTypes = {
	data: object,
	pageIndex: number,
	handleRemovePage: func,
}
