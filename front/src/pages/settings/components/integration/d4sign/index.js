import React from 'react'
import { Input, Button, Form, Checkbox } from 'antd'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { saveIntegration } from '~/states/modules/integrations'

import logoD4sign from '~/assets/logo-d4sign.png'

const D4sign = ({
	checkD4sign,
	onCheckD4sign,
	company,
	signatures_provider,
}) => {
	const [formD4] = Form.useForm()
	const dispatch = useDispatch()

	const saveIntegrationD4sign = () => {
		dispatch(
			saveIntegration({
				fields: { ...formD4.getFieldsValue(), company_id: company.id },
				d4sign: true,
			})
		)
		formD4.resetFields()
	}

	if (company && signatures_provider === 'd4sign') {
		formD4.setFieldsValue(company)
	}
	return (
		<div
			style={{
				padding: '30px 0 30px 0',
				borderTop: '1px solid #e8e8e8',
				borderBottom: '1px solid #e8e8e8',
			}}>
			<Checkbox
				style={{
					fontSize: '16px',
					color: 'black',
					fontWeight: '600',
				}}
				checked={checkD4sign}
				onChange={onCheckD4sign}>
				<img
					src={logoD4sign}
					style={{
						height: '47px',
						width: '47px',
						margin: '0 12px',
					}}
					alt="d4sign"
				/>
				D4sign
			</Checkbox>
			<Form
				form={formD4}
				id="integrationD4signForm"
				onFinish={saveIntegrationD4sign}>
				{checkD4sign ? (
					<div style={{ marginTop: '60px' }}>
						<Form.Item
							label="Token da API"
							name="d4sign_api_token"
							rules={[
								{ required: true, message: 'Este campo é obrigatório.' },
							]}>
							<Input value="" />
						</Form.Item>
						<Form.Item label="Chave Crypt" name="d4sign_api_cryptkey">
							<Input
								value={''}
								placeholder={
									signatures_provider !== 'd4sign'
										? ''
										: '••••••••••••••••••••••••••••••'
								}
							/>
						</Form.Item>

						<Form.Item label="Chave HMAC" name="d4sign_api_hmac_secret">
							<Input
								value={''}
								placeholder={
									signatures_provider !== 'd4sign'
										? ''
										: '••••••••••••••••••••••••••••••'
								}
							/>
						</Form.Item>
						<Form.Item
							label="Nome do Cofre"
							name="d4sign_safe_name"
							rules={[
								{ required: true, message: 'Este campo é obrigatório.' },
							]}>
							<Input value="" />
						</Form.Item>
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
							}}>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									form="integrationD4signForm">
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

D4sign.propTypes = {
	checkD4sign: PropTypes.bool,
	onCheckD4sign: PropTypes.func,
	company: PropTypes.object,
	signatures_provider: PropTypes.string,
}

export default D4sign
