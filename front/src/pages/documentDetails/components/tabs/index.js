import React, { useState } from 'react'
import { Form, Radio, Typography, Button, Spin, Menu } from 'antd'
import { array, bool, func, string } from 'prop-types'
import { ContainerTabs, ContainerInfo } from './styles'
import styles from './index.module.scss'
import * as moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

const { Title, Text } = Typography
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
					{item.fields.map((item, index) => {
						return (
							<ContainerInfo key={index}>
								<Text
									style={{ color: '#000', fontSize: 12, marginBottom: 0 }}
									key={item.label + index}>
									{item.label}:
								</Text>
								<Text
									style={{ color: '#646464', fontSize: 16, marginBottom: 14 }}
									key={item.value + index}>
									{item.value}
								</Text>
							</ContainerInfo>
						)
					})}
				</ContainerTabs>
			)
		})

	const version = () => (
		<Menu
			onClick={(item) => handleVersion(item.key)}
			style={{ width: '100%' }}
			selectedKeys={[versionId]}
			mode="inline">
			{versions.map((item) => (
				<Menu.Item style={{ height: 80 }} key={item.id}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}>
						<Text style={{ color: '#000', fontSize: 16 }}>
							{item.description}
						</Text>
						<Text style={{ color: '#646464', fontSize: 12 }}>
							{moment(item.created_at).fromNow()}
						</Text>
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
						<ContainerInfo key={index}>
							<Text style={{ color: '#000', fontSize: 12, marginBottom: 0 }}>
								{field.value}
							</Text>
							<Text
								style={{ color: '#646464', fontSize: 16, marginBottom: 14 }}>
								{!field.valueVariable ? '' : field.valueVariable}
							</Text>
						</ContainerInfo>
					))}
					{signed && (
						<ContainerInfo>
							<Text style={{ color: '#000', fontSize: 12, marginBottom: 0 }}>
								Status
							</Text>
							<Text
								style={{ color: '#646464', fontSize: 16, marginBottom: 14 }}>
								{item.status}
							</Text>
						</ContainerInfo>
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
				minWidth: 500,
				background: '#fff',
				alignItems: 'center',
			}}>
			<Radio.Group
				buttonStyle="solid"
				value={value}
				onChange={(e) => {
					setVariables(false)
					setValue(e.target.value)
				}}>
				<Radio.Button value="1">Info</Radio.Button>
				<Radio.Button value="2">Versões</Radio.Button>
				<Radio.Button value="3">Assinantes</Radio.Button>
			</Radio.Group>
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
