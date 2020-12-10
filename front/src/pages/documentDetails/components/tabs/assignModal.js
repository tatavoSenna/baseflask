import React from 'react'
import { Button, Modal, Form, Typography, Divider } from 'antd'
import PropTypes from 'prop-types'
import InputFactory from './inputFactory'

const { Title } = Typography

const AssignModal = ({ handleAssign, handleCancel, showModal, signers }) => {
	const [form] = Form.useForm()

	return (
		<Modal
			visible={showModal}
			onCancel={handleCancel}
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button key="salvar" type="primary" htmlType="submit" form="assignForm">
					Salvar
				</Button>,
			]}>
			<Form
				form={form}
				id="assignForm"
				layout="horizontal"
				hideRequiredMark
				onFinish={() => {
					handleCancel()
					handleAssign(form)
				}}>
				<Title level={2}>{'Assinaturas'}</Title>
				<Divider />
				{signers.map((item, index) => (
					<div key={index}>
						<Title level={4}>{item.title}</Title>
						{InputFactory(item.fields)}
					</div>
				))}
			</Form>
		</Modal>
	)
}

AssignModal.propTypes = {
	handleAssign: PropTypes.func,
	handleCancel: PropTypes.func,
	showModal: PropTypes.bool,
	signers: PropTypes.array,
}

AssignModal.defaultProps = {
	signers: [],
}

export default AssignModal
