import React, { useState } from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, Upload, message, Modal, Input } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import InfoField from '~/components/infoField'
const ImageField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, info, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const [fileList, setFileList] = useState('')
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState('')

	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	)

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
		if (!isJpgOrPng) {
			message.error('Por favor, selecione um arquivo JPG/PNG!')
		} else {
			getBase64(file, (imageUrl) => {
				file.url = imageUrl
				setLoading(false)
				setFileList([file])
			})
		}
		return false
	}

	const getBase64 = (img, callback) => {
		const reader = new FileReader()
		reader.addEventListener('load', () => callback(reader.result))
		reader.readAsDataURL(img)
	}

	return (
		<Form.Item
			key={`imageField_${isObj ? variable.name : variable}`}
			name={`image_${isObj ? variable.name : variable}`}
			label={<InfoField label={label} info={info} />}
			className={className}
			colon={false}
			rules={[{ required: !optional, message: 'Este campo é obrigatório.' }]}
			value={fileList.length > 0 ? fileList[0].url : ''}>
			<div style={{ display: 'flex', marginBottom: '1rem' }}>
				<Input
					name={'input'}
					value={fileList.length > 0 ? fileList[0].url : ''}
					hidden
				/>
				<Upload
					fileList={fileList}
					listType="picture-card"
					multiple={false}
					beforeUpload={beforeUpload}
					onChange={onChange}
					onPreview={() => setVisible(true)}
					onRemove={() => setFileList([])}>
					{fileList.length === 0 && uploadButton}
				</Upload>
				<Modal
					visible={visible}
					title={fileList.length > 0 ? fileList[0].name : ''}
					footer={null}
					onCancel={() => setVisible(false)}>
					<img
						alt="imagem"
						style={{ width: '100%' }}
						src={fileList.length > 0 ? fileList[0].url : ''}
					/>
				</Modal>
			</div>
		</Form.Item>
	)
}

ImageField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		info: string,
	}).isRequired,
	onChange: func,
	className: string,
}

export default ImageField
