import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select
var groupSelect = null

const UserEditModal = ({
	handleUpdate,
	handleCancel,
	handleEditUser,
	editUser,
	showModal,
	groups,
}) => {
	const [form] = Form.useForm()
	form.setFieldsValue({
		email: editUser.email,
		groups: editUser.groups,
	})

	const children = []
	groups.map((item) =>
		children.push(<Option key={item.id}>{item.name}</Option>)
	)

	return (
		<Modal
			forceRender
			visible={showModal}
			onCancel={handleCancel}
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button key="criar" onClick={handleUpdate} form="editUserForm">
					Salvar
				</Button>,
			]}
		>
			<Form form={form} id="editUserForm" onChange={() => handleEditUser(form)}>
				<Form.Item label="Editar usuário"></Form.Item>
				<Form.Item label="Nome" name="name">
					<Input disabled={true} />
				</Form.Item>
				<Form.Item label="Email" name="email">
					<Input disabled={true} />
				</Form.Item>
				<Form.Item label="Grupos" name="groups">
					<Select
						ref={(select) => (groupSelect = select)}
						mode="multiple"
						allowClear
						style={{ width: '100%' }}
						placeholder="Selecione o grupo"
						onChange={() => handleEditUser(form)}
						onSelect={() => groupSelect.blur()}
						onDeselect={() => groupSelect.blur()}
					>
						{children}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	)
}

UserEditModal.propTypes = {
	handleUpdate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleEditUser: PropTypes.func,
	editUser: PropTypes.object,
	showModal: PropTypes.bool,
	groups: PropTypes.array,
}

UserEditModal.defaultProps = {
	groups: [],
}

export default UserEditModal
