import React from 'react'
import { useDispatch } from 'react-redux'
import { array, number, string } from 'prop-types'
import { Card, Form, Input, Button, Empty } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import {
	editTemplateSignersInfo,
	editTemplateSignerAdd,
	editTemplatePartyRemove,
} from '~/states/modules/editTemplate'
import Delete from '~/components/deleteConfirm'
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

		dispatch(editTemplateSignerAdd({ newSigner, partyIndex }))
	}

	const handleRemoveParty = () =>
		dispatch(editTemplatePartyRemove({ partyIndex }))

	const updateSignerInfo = (e, partyIndex, signerIndex, name) => {
		const value = e.target.value
		dispatch(editTemplateSignersInfo({ value, partyIndex, signerIndex, name }))
	}

	return (
		<Card
			style={{
				marginBottom: '1rem',
				boxShadow: '0 1px 4px 0 rgba(192, 208, 230, 0.8)',
				borderRadius: '5px',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '24px',
				}}>
				<Form.Item
					name={`party_${partyIndex}`}
					label="Parte"
					style={{ width: '50%', margin: '0 0 0 8px' }}
					onChange={(e) => updateSignerInfo(e, partyIndex, 0, 'partyTitle')}
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
					<Input value={title} />
				</Form.Item>
				<Delete
					handle={() => handleRemoveParty()}
					title="Deseja excluir essa parte?"
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
