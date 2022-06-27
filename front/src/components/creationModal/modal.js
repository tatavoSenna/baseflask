import React, { useState } from 'react'
import { Input, Button, Modal, Form } from 'antd'
import { bool, func, string } from 'prop-types'

const CreationModal = ({
	title,
	label = 'Nome',
	handleCreate,
	handleCancel,
	showModal,
}) => {
	const [name, setName] = useState('')

	return (
		<Modal
			visible={showModal}
			onCancel={handleCancel}
			title={title}
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button
					type="primary"
					key="criar"
					onClick={() => handleCreate(name)}
					disabled={!name}>
					Criar
				</Button>,
			]}>
			<Form.Item label={label}>
				<Input
					autoFocus
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</Form.Item>
		</Modal>
	)
}

CreationModal.propTypes = {
	title: string,
	label: string,
	handleCreate: func,
	handleCancel: func,
	showModal: bool,
}

export default CreationModal
