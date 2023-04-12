import React, { useEffect, useState } from 'react'
import { Button, Typography, Upload } from 'antd'
import { Container, SCard } from 'pages/settings/styles'
import { UploadOutlined } from '@ant-design/icons'
import BaseDocumentService from './service'
import styled from 'styled-components'

const { Title, Paragraph } = Typography

const BaseDocument = () => {
	const { loading, loadingName, baseDocument, uploadFile } =
		BaseDocumentService()

	// controlling loading upload and loading document name
	const [loadingsController, setLoadingsController] = useState(loadingName)

	useEffect(() => {
		setLoadingsController(loading || loadingName)
	}, [setLoadingsController, loading, loadingName])

	const status = baseDocument ? baseDocument : 'Nenhum documento disponível'
	return (
		<SCard loading={loadingsController}>
			<Container>
				<Title style={{ margin: 0 }} level={4}>
					Documento base
				</Title>
				<ButtonText>
					<SParagraph $color={baseDocument}>{status}</SParagraph>
					<Upload
						accept=".docx"
						multiple={false}
						showUploadList={false}
						beforeUpload={(file) => {
							uploadFile(file)
							return false
						}}>
						<Button icon={<UploadOutlined />}>Enviar</Button>
					</Upload>
				</ButtonText>
			</Container>
		</SCard>
	)
}

export default BaseDocument

const SParagraph = styled(Paragraph)`
	font-size: 14px;
	margin: 0 !important;
	color: ${({ $color }) => ($color ? '#000000D9' : '#FF4D4F')};
`

const ButtonText = styled.div`
	display: flex;
	margin: 24px 0 0;
	align-items: center;
	gap: 24px;
`
