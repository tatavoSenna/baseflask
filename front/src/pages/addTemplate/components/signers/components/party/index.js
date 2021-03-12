import React from 'react'
import { useDispatch } from 'react-redux'
import { array, number, string } from 'prop-types'
import { Card, Form, Input, Button, Empty } from 'antd'
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons'

import {
	postTemplateSignersInfo,
	postTemplateSignerAdd,
	postTemplatePartyRemove,
} from '~/states/modules/postTemplate'

import Signer from '../signer'

const Party = ({ signers, partyIndex, title }) => {
	const dispatch = useDispatch()

	const handleAddSigner = (title) => {
		const newSigner = {
			title: '',
			party: title,
			anchor: [
				{
					anchor_string: '',
					anchor_x_offset: 0.0,
					anchor_y_offset: 0.0,
				},
			],
			fields: [
				{
					type: 'text',
					label: '',
					value: 'Nome',
					variable: '',
				},
				{
					type: 'email',
					label: '',
					value: 'Email',
					variable: '',
				},
			],
			status: '',
			signing_date: '',
		}

		dispatch(postTemplateSignerAdd({ newSigner, partyIndex }))
	}

	const handleRemoveParty = () =>
		dispatch(postTemplatePartyRemove({ partyIndex }))

	const updateSignerInfo = (e, partyIndex, signerIndex, name) => {
		const value = e.target.value
		dispatch(postTemplateSignersInfo({ value, partyIndex, signerIndex, name }))
	}

	return (
		<Card style={{ marginBottom: '1rem' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Form.Item
					name={`party_${partyIndex}`}
					label="Parte"
					style={{ width: '50%', marginLeft: '8px' }}
					onChange={(e) => updateSignerInfo(e, partyIndex, 0, 'partyTitle')}
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
					<Input value={title} />
				</Form.Item>
				<Button icon={<DeleteOutlined />} onClick={() => handleRemoveParty()} />
			</div>
			{!signers.length ? (
				<Empty description="Sem Assinantes" style={{ marginBottom: '1rem' }} />
			) : (
				signers.map((signer, index) => (
					<Signer
						key={index}
						data={signer}
						partyIndex={partyIndex}
						signerIndex={index}
						updateSignerInfo={updateSignerInfo}
					/>
				))
			)}
			<Button
				onClick={() => handleAddSigner(title)}
				type="primary"
				icon={<UserAddOutlined />}
				style={{
					display: 'inline-block',
					float: 'right',
				}}>
				Novo Assinante
			</Button>
		</Card>
	)
}

export default Party

Party.propTypes = {
	signers: array,
	partyIndex: number,
	title: string,
}
