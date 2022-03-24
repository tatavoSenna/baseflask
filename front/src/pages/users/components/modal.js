import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select
var groupSelect = null

const UserModal = ({
	handleCreate,
	handleCancel,
	handleNewUser,
	newUser,
	showModal,
	groups,
}) => {
	const [form] = Form.useForm()

	const children = []
	groups.map((item) =>
		children.push(<Option key={item.id}>{item.name}</Option>)
	)

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
			<Form form={form} id="newUserForm" onChange={() => handleNewUser(form)}>
				<Form.Item label="Novo Usuário"></Form.Item>
				<Form.Item label="Nome" name="name">
					<Input value={newUser.name} />
				</Form.Item>
				<Form.Item label="Email" name="email">
					<Input />
				</Form.Item>
				<Form.Item label="Grupos" name="groups">
					<Select
						ref={(select) => (groupSelect = select)}
						mode="multiple"
						allowClear
						style={{ width: '100%' }}
						placeholder="Selecione o grupo"
						onChange={() => handleNewUser(form)}
						onSelect={() => groupSelect.blur()}
						onDeselect={() => groupSelect.blur()}>
						{children}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	)
}

UserModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleNewUser: PropTypes.func,
	newUser: PropTypes.object,
	showModal: PropTypes.bool,
	groups: PropTypes.array,
}

UserModal.defaultProps = {
	groups: [],
}

export default UserModal
