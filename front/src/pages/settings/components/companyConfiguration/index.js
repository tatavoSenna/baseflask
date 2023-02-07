import React from 'react'
import { Button, Typography, Upload, Form } from 'antd'
import { useDispatch } from 'react-redux'
import { saveSettings } from '~/states/modules/settings'
import { UploadOutlined } from '@ant-design/icons'
import { Container, SCard } from 'pages/settings/styles'

const { Title } = Typography

const CompanyConfiguration = () => {
	const dispatch = useDispatch()
	let logo = ''

	const saveSettingsLogo = () => {
		if (logo) {
			const file = logo.toString().substring(22)
			dispatch(saveSettings({ img: file }))
		}
	}

	return (
		<SCard>
			<Container>
				<Title style={{ marginBottom: 30 }} level={4}>
					{'Configurações da Empresa'}
				</Title>
				<Form>
					<Form.Item label="Upload da logo: ">
						<Upload
							accept=".png, .jpg"
							showUploadList={false}
							multiple={false}
							beforeUpload={(file) => {
								const reader = new FileReader()
								reader.readAsDataURL(file)
								reader.onload = function (e) {
									logo = e.target.result
								}
								return false
							}}>
							<Button icon={<UploadOutlined />}>Upload</Button>
						</Upload>
					</Form.Item>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}>
						<Button type="primary" htmlType="submit" onClick={saveSettingsLogo}>
							Salvar
						</Button>
					</div>
				</Form>
			</Container>
		</SCard>
	)
}

export default CompanyConfiguration
