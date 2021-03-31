import React, { useState } from 'react'
import { Form, Typography, Button, Spin, Menu, Divider } from 'antd'
import { array, bool, func, string } from 'prop-types'
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
	signers,
	versions,
	infos,
	showAssignModal,
	signed,
	handleVersion,
	sentAssign,
	loadingSign,
	versionId,
}) => {
	const [value, setValue] = useState('1')
	const [isVariables, setVariables] = useState(false)

	const tab = (option) => {
		if (option === '1') {
			return info()
		} else if (option === '2') {
			return version()
		} else {
			return assign()
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

	const info = () =>
		infos.map((item, index) => {
			return (
				<ContainerTabs key={index}>
					<Title key={index} level={4} style={{ marginTop: 20, fontSize: 18 }}>
						{item.title}
					</Title>
					{item.fields.map((item, index) => (
						<div key={index}>
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
						</div>
					))}
					{infos.length - 1 !== index && <Divider />}
				</ContainerTabs>
			)
		})

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

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 24,
				margin: 5,
				minHeight: 500,
				width: 350,
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
				<Menu.Item style={{ width: 100, textAlign: 'center' }} key="3">
					Assinantes
				</Menu.Item>
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
	signers: array,
	versions: array,
	infos: array,
	showAssignModal: func,
	handleVersion: func,
	signed: bool,
	sentAssign: func,
	loadingSign: bool,
	versionId: string,
}

export default Tabs
