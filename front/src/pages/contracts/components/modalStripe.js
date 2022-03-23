import React from 'react'
import { Button, Modal } from 'antd'
import PropTypes from 'prop-types'

const StripeModal = ({
	handleCancel,
	showModal,
	handleConfirm,
	isFinancial,
	modalText,
}) => {
	return (
		<Modal
			title="Limite de documentos atingido"
			visible={showModal}
			onCancel={handleCancel}
			footer={
				isFinancial
					? [
							<Button key="cancelar" onClick={handleCancel}>
								Cancelar
							</Button>,
							<Button
								key="update"
								onClick={() => handleConfirm('/settings?tab=signature')}
							>
								Alterar plano
							</Button>,
					  ]
					: [
							<Button key="cancelar" onClick={handleCancel}>
								Cancelar
							</Button>,
					  ]
			}
		>
			<p>{modalText}</p>
		</Modal>
	)
}

StripeModal.propTypes = {
	handleCancel: PropTypes.func,
	showModal: PropTypes.bool,
	handleConfirm: PropTypes.func,
	isFinancial: PropTypes.bool,
	modalText: PropTypes.string,
}

export default StripeModal
