import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

UserModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleNewUser: PropTypes.func,
	newUser: PropTypes.object,
	showModal: PropTypes.bool,
}

function UserModal({
	handleCreate,
	handleCancel,
	handleNewUser,
	newUser,
	showModal,
}) {
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
					form="newUserForm"
					disabled={!(newUser.name && newUser.email)}>
					Criar
				</Button>,
			]}>
			<Form id="newUserForm" form={form} onChange={() => handleNewUser(form)}>
				<Form.Item label="Novo Usuário"></Form.Item>
				<Form.Item label="Nome" name="name">
					<Input value={newUser.name} />
				</Form.Item>
				<Form.Item label="Email" name="email">
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default UserModal
