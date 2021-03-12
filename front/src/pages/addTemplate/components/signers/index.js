import React from 'react'
import { useDispatch } from 'react-redux'
import { object } from 'prop-types'
import { Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { postTemplatePartyAdd } from '~/states/modules/postTemplate'

import Party from './components/party'

const Signers = ({ data }) => {
	const dispatch = useDispatch()

	const handleAddParty = () => {
		const newParty = {
			partyTitle: '',
			partySigners: [
				{
					title: '',
					party: '',
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
				},
			],
		}

		dispatch(postTemplatePartyAdd({ newParty }))
	}

	return (
		<div style={{ maxWidth: '40rem' }}>
			{!data.parties.length ? (
				<Empty description="Sem Partes" style={{ marginBottom: '1.5rem' }} />
			) : (
				data.parties.map((item, index) => (
					<Party
						key={index}
						signers={item.partySigners}
						partyIndex={index}
						title={item.partyTitle}
					/>
				))
			)}
			<Button
				block
				icon={<PlusOutlined />}
				size="large"
				type="dashed"
				onClick={() => handleAddParty()}
				style={{ height: '4rem', marginBottom: '1rem' }}>
				Nova Parte
			</Button>
		</div>
	)
}

export default Signers

Signers.propTypes = {
	data: object,
}
