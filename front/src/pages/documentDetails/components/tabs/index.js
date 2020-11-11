import React, { useState } from 'react'
import { Radio, Typography } from 'antd'
import { array } from 'prop-types'

const { Title, Text } = Typography

const Tabs = ({ signers }) => {
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

	const info = () => (
		<>
			<Title level={4}>CONTRATADA</Title>
			<Text>Razão Social</Text>
			<Text>Petardo Audio Visual LTDA</Text>
			<Text>CNPJ</Text>
			<Text>02.616.112/0001-8</Text>
			<Text>Endereço</Text>
			<Text>R. Eugênio Jardim, 33 sala 204 Rio de Janeiro - RJ 22098-033</Text>
			<Title level={4}>REPRESENTANTE</Title>
			<Text>Razão Social</Text>
			<Text>Petardo Audio Visual LTDA</Text>
			<Text>CNP</Text>
			<Text>02.616.112/0001-8</Text>
			<Text>Endereço</Text>
			<Text>R. Eugênio Jardim, 33 sala 204 Rio de Janeiro - RJ 22098-033</Text>
		</>
	)

	const version = () => (
		<>
			<Text>Versão 1</Text>
			<Text>Luiz Senna em 13/09/2020</Text>
		</>
	)

	const assign = () =>
		signers.map((signer, index) => (
			<div style={{ display: 'flex', flexDirection: 'column' }} key={index}>
				<Title level={4}></Title>
				<Text>Nome</Text>
				<Text>{signer.name}</Text>
				<Text>E-mail</Text>
				<Text>{signer.email}</Text>
			</div>
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
}

export default Tabs
