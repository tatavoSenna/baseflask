import React, { useState } from 'react'
import { Form, Typography, Button, Spin, Menu, Divider } from 'antd'
import { array, bool, func, string } from 'prop-types'
import InputFactory from '~/components/inputFactory'
import ImageField from '~/components/imageField'
import StructuredList from './components/structuredList'
import PersonField from './components/personField'
import { ContainerTabs } from './styles'
import styles from './index.module.scss'
import * as moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

const { Title, Text, Paragraph } = Typography
const tailLayout = {
	wrapperCol: { span: 24 },
}

const Tabs = ({
	textType,
	downloadDocument,
	signers,
	versions,
	infos,
	showAssignModal,
	signed,
	handleVersion,
	sentAssign,
	loadingSign,
	versionId,
	onChangeVariables,
}) => {
	const [value, setValue] = useState('1')
	const [isVariables, setVariables] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [form] = Form.useForm()

	const tab = (option) => {
		if (option === '1') {
			return info()
		} else if (option === '2') {
			return version()
		} else if (option === '3') {
			return assign()
		} else {
			return downloads()
		}
	}

	if (!signed) {
		signers.map((item) =>
			item.fields.map((field) => {
				if (field.valueVariable && !isVariables) {
					setVariables(true)
				}
				return null
			})
		)
	}

	const textView = (item) =>
		item.fields.map((item, index) => (
			<div key={index}>
				{item.hasOwnProperty('subtitle') ? (
					<>
						<Title level={4} style={{ marginTop: 10, fontSize: 15 }}>
							{item.subtitle}
						</Title>
						{item.items.map((item_list, index) => (
							<>
								{Array.isArray(item_list) ? (
									item_list.map((item, index) => (
										<>
											<Paragraph
												style={{
													color: '#000',
													fontSize: 10,
													marginBottom: 0,
													marginLeft: '10px',
												}}
												key={item.label + index}>
												{item.label}:
											</Paragraph>
											<Paragraph
												style={{
													color: '#646464',
													fontSize: 14,
													marginBottom: 14,
													marginLeft: '10px',
												}}
												key={item.value + index}>
												{item.value}
											</Paragraph>
										</>
									))
								) : (
									<>
										<Paragraph
											style={{ color: '#000', fontSize: 12, marginBottom: 0 }}
											key={item_list.label + index}>
											{item_list.label}:
										</Paragraph>
										<Paragraph
											style={{
												color: '#646464',
												fontSize: 16,
												marginBottom: 14,
											}}
											key={item_list.value + index}>
											{item_list.value}
										</Paragraph>
									</>
								)}
								{item.items.length - 1 !== index && <Divider />}
							</>
						))}
					</>
				) : (
					<>
						<Paragraph
							style={{ color: '#000', fontSize: 12, marginBottom: 0 }}
							key={item.label + index}>
							{item.label}:
						</Paragraph>
						<Paragraph
							style={{ color: '#646464', fontSize: 16, marginBottom: 14 }}
							key={item.value + index}>
							{item.value}
						</Paragraph>
					</>
				)}
			</div>
		))

	const inputView = (item) => (
		<Form
			id="infoForm"
			form={form}
			layout="horizontal"
			onFinish={(values) => {
				onChangeVariables(values)
				setIsEdit(false)
			}}>
			{item.fields.map((item, index) => {
				switch (item.type) {
					case 'structured_list':
						return <StructuredList item={item} disabled={!isEdit} />
					case 'person':
						return <PersonField item={item} disabled={!isEdit} />
					case 'variable_image':
						return isEdit && <ImageField pageFieldsData={item} />
					default:
						return (
							<InputFactory
								key={index}
								data={[item]}
								visible={[true]}
								disabled={!isEdit}
								initialValues={[item.value]}
							/>
						)
				}
			})}
		</Form>
	)

	const buttonsView = () => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				marginTop: 10,
			}}>
			<Form.Item {...tailLayout}>
				{!isEdit && (
					<Button
						key="edit"
						className={styles.button}
						onClick={() => setIsEdit(true)}
						disabled={loadingSign}>
						Editar
					</Button>
				)}
				{isEdit && (
					<Button
						key="cancel"
						className={styles.button}
						onClick={() => setIsEdit(false)}
						disabled={loadingSign}>
						Cancelar
					</Button>
				)}
				{isEdit && (
					<Button
						key="save"
						type="primary"
						htmlType="submit"
						form="infoForm"
						disabled={loadingSign}>
						Salvar
					</Button>
				)}
			</Form.Item>
		</div>
	)

	const info = () => (
		<div>
			{infos.map((item, index) => (
				<div key={index}>
					<ContainerTabs key={index}>
						<Title
							key={index}
							level={4}
							style={{ marginTop: 20, fontSize: 18 }}>
							{item.title}
						</Title>
						{textType === '.docx' ? inputView(item) : textView(item)}
						{infos.length - 1 !== index && <Divider />}
					</ContainerTabs>
				</div>
			))}
			{textType === '.docx' && buttonsView()}
		</div>
	)

	const version = () => (
		<Menu
			onClick={(item) => handleVersion(item.key)}
			style={{ width: '100%', border: 'none' }}
			selectedKeys={[versionId]}
			mode="vertical">
			{versions.map((item) => (
				<Menu.Item style={{ height: 80 }} key={item.id}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							height: 80,
						}}>
						<Text style={{ color: '#000', fontSize: 16, lineHeight: 2.5 }}>
							{item.description}
						</Text>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}>
							<Text style={{ color: '#646464', fontSize: 12, lineHeight: 1.5 }}>
								por{' '}
								<Text style={{ color: '#000', fontSize: 12, lineHeight: 1.5 }}>
									{item.email}
								</Text>
							</Text>
							<Text style={{ color: '#646464', fontSize: 12, lineHeight: 1.5 }}>
								{moment(item.created_at).fromNow()}
							</Text>
						</div>
					</div>
				</Menu.Item>
			))}
		</Menu>
	)

	const assign = () => (
		<div>
			{signers.map((item, index) => (
				<ContainerTabs key={index}>
					<Title level={4} style={{ marginTop: 20, fontSize: 18 }}>
						{item.title}
					</Title>
					{item.fields.map((field, index) => (
						<div key={index}>
							<Paragraph
								style={{ color: '#000', fontSize: 12, marginBottom: 0 }}>
								{field.value}:
							</Paragraph>
							<Paragraph
								style={{ color: '#646464', fontSize: 16, marginBottom: 14 }}>
								{!field.valueVariable ? '' : field.valueVariable}
							</Paragraph>
						</div>
					))}
					{signed && (
						<div>
							<Paragraph
								style={{ color: '#000', fontSize: 12, marginBottom: 0 }}>
								Status
							</Paragraph>
							<Paragraph
								style={{ color: '#646464', fontSize: 16, marginBottom: 14 }}>
								{item.status}
							</Paragraph>
						</div>
					)}
				</ContainerTabs>
			))}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 10,
				}}>
				<Form.Item {...tailLayout}>
					{!signed && (
						<Button
							key="editar"
							className={styles.button}
							onClick={() => showAssignModal(true)}
							disabled={loadingSign}>
							Editar
						</Button>
					)}
					{!signed && isVariables && (
						<Button
							key="assinar"
							type="primary"
							onClick={loadingSign ? () => {} : sentAssign}>
							{loadingSign ? <Spin spinning={loadingSign} /> : 'Assinar'}
						</Button>
					)}
				</Form.Item>
			</div>
		</div>
	)

	const downloads = () => (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 10,
				}}>
				<Form.Item {...tailLayout}>
					<Button
						key="download"
						type="primary"
						className={styles.button}
						onClick={downloadDocument}
						disabled={loadingSign}>
						Download do documento word
					</Button>
				</Form.Item>
			</div>
		</div>
	)

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 24,
				margin: 5,
				minHeight: 500,
				width: textType === '.docx' ? 500 : 350,
				background: '#fff',
				alignItems: 'center',
				border: '1px solid #F0F0F0',
			}}>
			<Menu
				onClick={(e) => {
					setVariables(false)
					setValue(e.key)
				}}
				selectedKeys={[value]}
				mode="horizontal">
				<Menu.Item style={{ width: 100, textAlign: 'center' }} key="1">
					Info
				</Menu.Item>
				<Menu.Item style={{ width: 100, textAlign: 'center' }} key="2">
					Versões
				</Menu.Item>
				{signers.length > 0 && (
					<Menu.Item style={{ width: 100, textAlign: 'center' }} key="3">
						Assinantes
					</Menu.Item>
				)}
				{textType === '.docx' && (
					<Menu.Item style={{ width: 100, textAlign: 'center' }} key="4">
						Downloads
					</Menu.Item>
				)}
			</Menu>
			<div
				style={{
					padding: 10,
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}>
				{tab(value)}
			</div>
		</div>
	)
}

Tabs.propTypes = {
	textType: string,
	downloadDocument: func,
	signers: array,
	versions: array,
	infos: array,
	showAssignModal: func,
	handleVersion: func,
	signed: bool,
	sentAssign: func,
	loadingSign: bool,
	versionId: string,
	onChangeVariables: func,
}

export default Tabs
