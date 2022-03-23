import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

const NewVersionModal = ({
	handleCreate,
	handleCancel,
	handleDescription,
	showModal,
	description,
}) => {
	const [form] = Form.useForm()

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
					onClick={() => handleCreate(form)}
					form="newVersionForm"
					disabled={!description}
				>
					Criar
				</Button>,
			]}
		>
			<Form
				form={form}
				id="newVersionForm"
				onChange={() => handleDescription(form)}
			>
				<Form.Item label="Nova versão"></Form.Item>
				<Form.Item label="Descrição" name="description">
					<Input value={description} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

NewVersionModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleDescription: PropTypes.func,
	showModal: PropTypes.bool,
	description: PropTypes.string,
}

export default NewVersionModal
