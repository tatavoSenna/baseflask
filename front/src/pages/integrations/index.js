import React, { useEffect } from 'react'
import { Layout, PageHeader, Card, Input, Button, Form, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import BreadCrumb from '~/components/breadCrumb'

import { getIntegration, saveIntegration } from '~/states/modules/integrations'

const { Title } = Typography

const Integrations = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const { loading, company } = useSelector(({ integrations }) => integrations)
	useEffect(() => {
		dispatch(getIntegration())
	}, [dispatch])

	const saveIntegrationDocusign = () => {
		dispatch(saveIntegration(form.getFieldsValue()))
		form.resetFields()
	}
	if (company) {
		form.setFieldsValue(company)
	}
	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			<PageHeader>
				<BreadCrumb parent="Integração" current={'Docusign'} />
			</PageHeader>
			<Card
				style={{
					maxWidth: '800px',
					width: '100%',
					background: 'white',
				}}
				loading={loading}>
				<Title style={{ marginBottom: 30 }} level={4}>
					{'Integração com Docusign'}
				</Title>
				<Form
					form={form}
					id="integrationForm"
					onFinish={saveIntegrationDocusign}>
					<Form.Item
						label="ID da conta"
						name="docusign_account_id"
						rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
						<Input value="" />
					</Form.Item>
					<Form.Item
						label="Chave de integração da API"
						name="docusign_integration_key"
						rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
						<Input value="" />
					</Form.Item>
					<Form.Item label="Chave secreta da API" name="docusign_secret_key">
						<Input
							value={''}
							placeholder={
								!company.docusign_account_id
									? ''
									: '••••••••••••••••••••••••••••••'
							}
						/>
					</Form.Item>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}>
						<Form.Item>
							<Button type="primary" htmlType="submit" form="integrationForm">
								Salvar
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Card>
		</Layout>
	)
}

export default Integrations
