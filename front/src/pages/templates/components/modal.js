import React, { useState } from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

const TemplateModal = ({ handleCreate, handleCancel, showModal }) => {
	const [form] = Form.useForm()
	const [title, setTitle] = useState('')

	return (
		<Modal
			visible={showModal}
			onCancel={handleCancel}
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button
					key="criar"
					onClick={() => handleCreate(title)}
					form="newTemplateForm"
					disabled={!title}>
					Criar
				</Button>,
			]}>
			<Form form={form} id="newTemplateForm">
				<Form.Item label="Novo Modelo"></Form.Item>
				<Form.Item label="Título" name="title">
					<Input
						autoFocus
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

TemplateModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleNewTemplate: PropTypes.func,
	newTemplate: PropTypes.object,
	showModal: PropTypes.bool,
}

export default TemplateModal
