import React from 'react'
import { useDispatch } from 'react-redux'
import { array, number, string, object } from 'prop-types'
import { Card, Form, Input, Button, Empty } from 'antd'
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons'

import {
	postTemplateSignersInfo,
	postTemplateSignersAdd,
	postTemplatePartyRemove,
} from '~/states/modules/postTemplate'

import Signer from '../signer'

const Party = ({ signers, partyIndex, title, validation }) => {
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

		const validation = {
			title: false,
			anchor: [{ anchor_string: false }],
			fields: [false, false],
		}

		dispatch(postTemplateSignersAdd({ newSigner, validation, partyIndex }))
	}

	const handleRemoveParty = (partyIndex) =>
		dispatch(postTemplatePartyRemove({ partyIndex }))

	const updateSignerInfo = (e, partyIndex, signerIndex, name) => {
		const value = e.target.value
		dispatch(postTemplateSignersInfo({ value, partyIndex, signerIndex, name }))
	}

	return (
		<Card style={{ marginBottom: '1rem' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Form.Item
					label="Parte"
					style={{ width: '50%', marginLeft: '8px' }}
					onChange={(e) => updateSignerInfo(e, partyIndex, 0, 'partyTitle')}
					validateStatus={validation.title && 'error'}
					help={validation.title && 'Este campo é obrigatório.'}>
					<Input value={title} />
				</Form.Item>
				<Button
					icon={<DeleteOutlined />}
					onClick={() => handleRemoveParty(partyIndex)}
				/>
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
						validation={validation.signers[index]}
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
	validation: object,
}
