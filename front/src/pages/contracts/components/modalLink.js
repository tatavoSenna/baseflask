import React, { useState } from 'react'
import { Input, Button, Modal, Form, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { CopyOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const LinkModal = ({ handleOk, showModal, link }) => {
	const [form] = Form.useForm()
	const [title, setTitle] = useState('Copiar Link')
	return (
		<Modal
			visible={showModal}
			onCancel={handleOk}
			footer={[
				<Button key="ok" onClick={handleOk} form="LinkForm">
					OK
				</Button>,
			]}>
			<Form form={form} id="LinkForm">
				<Form.Item label="Novo Link Documento"></Form.Item>
				<Form.Item label="Link">
					<Form.Item
						name="link"
						initialValue={link}
						style={{
							display: 'inline-block',
							width: 'calc(90% - 8px)',
							margin: '0 5px 0 0',
						}}>
						<Input value={link} disabled />
					</Form.Item>
					<Tooltip title={title}>
						<CopyToClipboard text={link}>
							<Button
								type="primary"
								icon={<CopyOutlined />}
								onClick={() => {
									setTitle('Copiado')
								}}
							/>
						</CopyToClipboard>
					</Tooltip>
				</Form.Item>
			</Form>
		</Modal>
	)
}

LinkModal.propTypes = {
	link: PropTypes.string,
	handleOk: PropTypes.func,
	showModal: PropTypes.bool,
}

export default LinkModal
