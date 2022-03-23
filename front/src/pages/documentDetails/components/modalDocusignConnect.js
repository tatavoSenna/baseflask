import React from 'react'
import { Button, Modal, Form, Typography, Divider } from 'antd'
import PropTypes from 'prop-types'

const { Title, Text } = Typography

const ConnectDocusignModal = ({ handleCancel, showModal }) => {
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
					key="connect"
					onClick={() =>
						window.location.assign(
							process.env.REACT_APP_DOCUSIGN_OAUTH_URL +
								'/auth?response_type=code&scope=signature&client_id=' +
								process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY +
								'&redirect_uri=' +
								process.env.REACT_APP_DOCUSIGN_REDIRECT_URL
						)
					}
					form="connectDocusignModalForm"
				>
					Sim
				</Button>,
			]}
		>
			<Form form={form} id="connectDocusignModalForm">
				<Title level={4}>{'Atenção'}</Title>
				<Divider />
				<Text>Deseja conectar ao Docusign?</Text>
			</Form>
		</Modal>
	)
}

ConnectDocusignModal.propTypes = {
	handleConnect: PropTypes.func,
	handleCancel: PropTypes.func,
	showModal: PropTypes.bool,
}

export default ConnectDocusignModal
