import React, { useEffect } from 'react'
import { Card, Typography, Form, Button, Input, Table, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import {
	getWebhooks,
	saveWebhooks,
	updateNewWebhook,
	deleteWebhooks,
} from '~/states/modules/settings'
import { getColumns } from './columns'

function Webhook() {
	const dispatch = useDispatch()
	const { webhookList, loading, newWebhook } = useSelector(
		({ settings }) => settings
	)

	useEffect(() => {
		dispatch(getWebhooks())
	}, [dispatch])

	//const handleGetWebhooks = () =>
	//	dispatch(getWebhooks())

	const handleSaveWebhooks = (form) => {
		dispatch(saveWebhooks())
		form.resetFields()
	}

	const handleNewWebhook = (form) => {
		dispatch(updateNewWebhook(form.getFieldsValue()))
	}

	const handleDeleteWebhook = (id) => {
		dispatch(deleteWebhooks({ id }))
	}

	const columns = getColumns(handleDeleteWebhook)
	const { Title } = Typography

	const [form] = Form.useForm()

	return (
		<div>
			<Card
				style={{
					maxWidth: '800px',
					width: '100%',
					background: 'white',
				}}>
				<Title style={{ marginBottom: 30 }} level={4}>
					{'Criar novo webhook'}
				</Title>
				<Form
					form={form}
					id="webhookForm"
					onChange={() => handleNewWebhook(form)}>
					<Form.Item label="Novo Webhook" name="webhook">
						<Input value={newWebhook.url} />
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
								form="webhookForm"
								key="criar"
								onClick={() => {
									handleSaveWebhooks(form)
								}}
								disabled={!newWebhook.url}>
								Adicionar
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Card>
			<Card
				style={{
					maxWidth: '800px',
					width: '100%',
					background: 'white',
					marginTop: '50px',
				}}>
				<Title style={{ marginBottom: 30 }} level={4}>
					{'Webhooks Criados'}
				</Title>
				<Table
					columns={columns}
					dataSource={webhookList}
					locale={{
						emptyText: (
							<Empty
								description={!loading ? 'Nenhum webhook encontrado' : ''}
							/>
						),
					}}
					loading={loading}
				/>
			</Card>
		</div>
	)
}

export default Webhook
