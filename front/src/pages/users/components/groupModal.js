import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

const GroupModal = ({
	handleCreate,
	handleCancel,
	handleNewGroup,
	newGroup,
	showModal,
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
					form="newGroupForm"
					disabled={!newGroup.name}>
					Criar
				</Button>,
			]}>
			<Form form={form} id="newGroupForm" onChange={() => handleNewGroup(form)}>
				<Form.Item label="Novo Grupo"></Form.Item>
				<Form.Item label="Nome" name="name">
					<Input value={newGroup.name} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

GroupModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleNewGroup: PropTypes.func,
	newGroup: PropTypes.object,
	showModal: PropTypes.bool,
}

export default GroupModal
