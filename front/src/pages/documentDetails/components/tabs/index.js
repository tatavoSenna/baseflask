import React, { useState } from 'react'
import { Radio, Typography } from 'antd'
import { array } from 'prop-types'
import { ContainerTabs, ContainerInfo } from './styles'

const { Title, Text } = Typography

const Tabs = ({ signers, infos }) => {
	const [value, setValue] = useState('1')

	const tab = (option) => {
		if (option === '1') {
			return info()
		} else if (option === '2') {
			return version()
		} else {
			return assign()
		}
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
		<>
			<Text>Versão 1</Text>
			<Text>Luiz Senna em 13/09/2020</Text>
		</>
	)

	const assign = () =>
		signers.map((signer, index) => (
			<ContainerTabs key={index}>
				<Title level={4}></Title>
				<Text>Nome</Text>
				<Text>{signer.name}</Text>
				<Text>E-mail</Text>
				<Text>{signer.email}</Text>
			</ContainerTabs>
		))

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
				onChange={(e) => setValue(e.target.value)}>
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
	infos: array,
}

export default Tabs
