import React, { useEffect, useState } from 'react'
import { Typography, Form, Button, Input, Table, Empty, Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import {
	getWebhooks,
	saveWebhooks,
	updateNewWebhook,
	deleteWebhooks,
	editWebhooks,
} from '~/states/modules/settings'
import { getColumns } from './columns'
import { Container, SCard } from 'pages/settings/styles'

function Webhook() {
	const dispatch = useDispatch()
	const { webhookList, loading, newWebhook } = useSelector(
		({ settings }) => settings
	)

	const [docx, setDocX] = useState(false)
	const [pdf, setPDF] = useState(false)

	const onChangeDocx = (e) => {
		setDocX(e.target.checked)
		setPDF(false)
	}

	const onChangePDF = (e) => {
		setPDF(e.target.checked)
		setDocX(false)
	}

	useEffect(() => {
		dispatch(getWebhooks())
	}, [dispatch])

	//const handleGetWebhooks = () =>
	//	dispatch(getWebhooks())

	const handleSaveWebhooks = (form) => {
		dispatch(saveWebhooks({ docx, pdf }))
		setDocX(false)
		setPDF(false)
		form.resetFields()
	}

	const handleNewWebhook = (form) => {
		dispatch(updateNewWebhook(form.getFieldsValue()))
	}

	const handleDeleteWebhook = (id) => {
		dispatch(deleteWebhooks({ id }))
	}

	const handleEditWebhook = (id, docx, pdf, url) => {
		dispatch(editWebhooks({ id, docx, pdf, url }))
	}

	const columns = getColumns(handleDeleteWebhook, handleEditWebhook)
	const { Title } = Typography

	const [form] = Form.useForm()

	return (
		<div>
			<SCard>
				<Container>
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
						<Checkbox checked={docx} onChange={onChangeDocx}>
							Word
						</Checkbox>
						<Checkbox checked={pdf} onChange={onChangePDF}>
							PDF
						</Checkbox>
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
				</Container>
			</SCard>
			<SCard>
				<Container>
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
				</Container>
			</SCard>
		</div>
	)
}

export default Webhook
