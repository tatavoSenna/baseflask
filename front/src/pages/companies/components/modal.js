import React from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'

const CompanyModal = ({
	handleAdd,
	handleCancel,
	handleNewCompany,
	newCompany,
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
					onClick={() => handleAdd(form)}
					form="newCompanyForm"
					disabled={!newCompany.name}>
					Criar
				</Button>,
			]}>
			<Form
				form={form}
				id="newCompanyForm"
				onChange={() => handleNewCompany(form)}>
				<Form.Item label="Nova Empresa"></Form.Item>
				<Form.Item label="Nome" name="name">
					<Input value={newCompany.name} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

CompanyModal.propTypes = {
	handleAdd: PropTypes.func,
	handleCancel: PropTypes.func,
	handleNewCompany: PropTypes.func,
	newCompany: PropTypes.object,
	showModal: PropTypes.bool,
}

export default CompanyModal
