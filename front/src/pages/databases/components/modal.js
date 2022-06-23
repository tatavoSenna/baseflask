import React, { useState } from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

const DatabaseModal = ({ handleCreate, handleCancel, showModal }) => {
	const [title, setTitle] = useState('')

	return (
		<Modal
			visible={showModal}
			onCancel={handleCancel}
			title="Novo banco de textos"
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button
					type="primary"
					key="criar"
					onClick={() => handleCreate(title)}
					disabled={!title}>
					Criar
				</Button>,
			]}>
			<Form.Item label="Nome">
				<Input
					autoFocus
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Form.Item>
		</Modal>
	)
}

DatabaseModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	showModal: PropTypes.bool,
}

export default DatabaseModal
