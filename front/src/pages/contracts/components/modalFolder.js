import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

const FolderModal = ({
	handleNewFolder,
	handleUpdate,
	handleCancel,
	showModal,
	newFolder,
	parent,
}) => {
	const [form] = Form.useForm()

	const handleNew = (form) => {
		handleNewFolder({ parent })
		form.resetFields()
	}

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
					onClick={() => handleNew(form)}
					form="newFolderForm"
					disabled={!newFolder.title}
				>
					Criar
				</Button>,
			]}
		>
			<Form form={form} id="newFolderForm" onChange={() => handleUpdate(form)}>
				<Form.Item label="Nova Pasta"></Form.Item>
				<Form.Item label="Título" name="title">
					<Input value={newFolder.title} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

FolderModal.propTypes = {
	handleCancel: PropTypes.func,
	handleNewFolder: PropTypes.func,
	showModal: PropTypes.bool,
	parent: PropTypes.number,
	newFolder: PropTypes.object,
	handleUpdate: PropTypes.func,
}

FolderModal.defaultProps = {
	parent: null,
}

export default FolderModal
