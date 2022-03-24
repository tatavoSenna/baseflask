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
				<Title level={2} style={{ textAlign: 'center', color: '#999999' }}>
					{'Assinaturas'}
				</Title>
				<Divider />
				{signers.map((item, index) => (
					<div key={index}>
						{index === 0 ? (
							<Title level={4} style={{ marginBottom: 10 }}>
								Parte: {item.party}
							</Title>
						) : null}
						{signers[index - 1] && item.party !== signers[index - 1].party ? (
							<Title level={4} style={{ marginTop: 40, marginBottom: 10 }}>
								Parte: {item.party}
							</Title>
						) : null}
						<Title
							level={4}
							style={{
								marginBottom: 20,
								fontSize: 18,
								fontWeight: 400,
								paddingTop: 20,
								paddingBottom: 10,
							}}>
							{item.title}
						</Title>
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
