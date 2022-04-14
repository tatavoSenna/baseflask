import React, { useState } from 'react'
import { string, shape, object } from 'prop-types'
import { Form, Upload, Tooltip } from 'antd'
import {
	InboxOutlined,
	QuestionCircleTwoTone,
	LoadingOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons'
import { fileUploadRequest } from '~/states/modules/fileField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'

const { Dragger } = Upload

const FileField = ({ pageFieldsData }) => {
	const { label, id, url, info, optional } = pageFieldsData
	const dispatch = useDispatch()
	const { loading, data } = useSelector(({ fileField }) => fileField)
	const [empty, setEmpty] = useState(true)

	const handleFileUpload = (file) => {
		dispatch(fileUploadRequest({ file, url }))
	}

	return (
		<Form.Item
			key={`fileField_${id}`}
			label={<InfoField label={label} info={info} />}
			colon={false}
			rules={[{ required: !optional, message: 'Este campo é obrigatório.' }]}>
			<div style={{ display: 'flex', marginBottom: '1rem' }}>
				<Dragger
					action={(file) => handleFileUpload(file)}
					onChange={(info) => {
						if (info.fileList.length > 0) {
							setEmpty(false)
						} else {
							setEmpty(true)
						}
					}}
					style={{ width: '365px' }}>
					{empty ? (
						<>
							<p
								className="ant-upload-drag-icon"
								style={{ fontSize: '20px', margin: '0 0 0 0' }}>
								<InboxOutlined />
							</p>
							<span style={{ fontSize: '13px', color: '#7a7a7a' }}>
								Clique ou arraste e solte para fazer o upload
							</span>
						</>
					) : loading ? (
						<>
							<p
								className="ant-upload-drag-icon"
								style={{ fontSize: '20px', margin: '0 0 0 0' }}>
								<LoadingOutlined style={{ fontSize: 40 }} spin />
							</p>
							<span style={{ fontSize: '13px', color: '#7a7a7a' }}>
								Extraindo variáveis do texto
							</span>
						</>
					) : data ? (
						<>
							<p style={{ fontSize: '20px', margin: '0 0 0 0' }}>
								<CloseCircleOutlined
									style={{ fontSize: 40, color: '#d11313' }}
								/>
							</p>
							<span
								style={{
									fontSize: '13px',
									marginTop: '.5rem',
									color: '#7a7a7a',
								}}>
								Extração das variáveis falhou
							</span>
						</>
					) : (
						<>
							<p style={{ fontSize: '20px', margin: '0 0 0 0' }}>
								<CheckCircleOutlined
									style={{ fontSize: 40, color: '#27c924' }}
								/>
							</p>
							<span
								style={{
									fontSize: '13px',
									marginTop: '.2rem',
									color: '#7a7a7a',
								}}>
								Variáveis extraídas com sucesso
							</span>
						</>
					)}
				</Dragger>
				<Tooltip
					placement="rightTop"
					title={
						'O arquivo enviado terá suas informações extraídas automaticamente e inseridas no documento criado.'
					}
					style={{ fontSize: '16px', fontWeight: 'bold' }}>
					<QuestionCircleTwoTone
						style={{ fontSize: '22px', marginLeft: '.7rem' }}
					/>
				</Tooltip>
			</div>
		</Form.Item>
	)
}

FileField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		info: string,
	}).isRequired,
}

export default FileField
