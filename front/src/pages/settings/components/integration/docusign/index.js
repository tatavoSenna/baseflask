import React from 'react'
import { Input, Button, Form, Checkbox } from 'antd'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { saveIntegration } from '~/states/modules/integrations'

import logoDocusign from '~/assets/logo-docusign.png'

const Docusign = ({
	checkDocusign,
	onCheckDocusign,
	company,
	signatures_provider,
}) => {
	const [formDocu] = Form.useForm()
	const dispatch = useDispatch()

	const saveIntegrationDocusign = () => {
		dispatch(
			saveIntegration({ fields: formDocu.getFieldsValue(), docusign: true })
		)
		formDocu.resetFields()
	}

	if (company && signatures_provider === 'docusign') {
		formDocu.setFieldsValue(company)
	}

	return (
		<div
			style={{
				padding: '30px 0 30px 0',
				borderTop: '1px solid #e8e8e8',
			}}
		>
			<Checkbox
				style={{
					fontSize: '16px',
					color: 'black',
					fontWeight: '600',
				}}
				checked={checkDocusign}
				onChange={onCheckDocusign}
			>
				<img
					src={logoDocusign}
					style={{
						height: '47px',
						width: '47px',
						margin: '0 12px',
					}}
					alt="docusign"
				/>
				Docusign
			</Checkbox>
			<Form
				form={formDocu}
				id="integrationDocusignForm"
				onFinish={saveIntegrationDocusign}
			>
				{checkDocusign ? (
					<div style={{ marginTop: '60px' }}>
						<Form.Item
							label="ID da conta"
							name="docusign_account_id"
							rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
						>
							<Input value="" />
						</Form.Item>
						<Form.Item
							label="Chave de integração da API"
							name="docusign_integration_key"
							rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
						>
							<Input value="" />
						</Form.Item>
						<Form.Item label="Chave secreta da API" name="docusign_secret_key">
							<Input
								value={''}
								placeholder={
									!company.docusign_account_id ||
									signatures_provider !== 'docusign'
										? ''
										: '••••••••••••••••••••••••••••••'
								}
							/>
						</Form.Item>
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									form="integrationDocusignForm"
								>
									Salvar
								</Button>
							</Form.Item>
						</div>
					</div>
				) : null}
			</Form>
		</div>
	)
}

Docusign.propTypes = {
	checkDocusign: PropTypes.bool,
	onCheckDocusign: PropTypes.func,
	company: PropTypes.object,
	signatures_provider: PropTypes.string,
}

export default Docusign
