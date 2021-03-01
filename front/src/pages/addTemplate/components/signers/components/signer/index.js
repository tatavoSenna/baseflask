import React from 'react'
import { useDispatch } from 'react-redux'
import { object, func, number } from 'prop-types'
import { Card, Form, Input, InputNumber, Badge, Divider } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import {
	postTemplateSignersInfo,
	postTemplateSignersRemove,
} from '~/states/modules/postTemplate'

const Signer = ({
	data,
	partyIndex,
	signerIndex,
	updateSignerInfo,
	validation,
}) => {
	const dispatch = useDispatch()
	const { fields } = data

	// Had to  create this function for the offset values because onChange with updateSignerInfo was not working properly with inputNumber arrows
	const updateAnchorOffset = (value, partyIndex, signerIndex, name) => {
		dispatch(postTemplateSignersInfo({ value, partyIndex, signerIndex, name }))
	}

	const handleRemoveSigner = (partyIndex, signerIndex) => {
		dispatch(postTemplateSignersRemove({ partyIndex, signerIndex }))
	}

	return (
		<Card
			actions={[
				<Badge count={signerIndex + 1} style={{ background: '#1890ff' }} />,
				<DeleteOutlined
					onClick={() => handleRemoveSigner(partyIndex, signerIndex)}
					key="delete"
				/>,
			]}
			style={{
				marginBottom: '3%',
			}}>
			<Form.Item
				label="Título"
				onChange={(e) => updateSignerInfo(e, partyIndex, signerIndex, 'title')}
				validateStatus={validation.title && 'error'}
				help={validation.title && 'Este campo é obrigatório.'}>
				<Input value={data.title} />
			</Form.Item>
			<Form.Item
				label="Variável do nome"
				onChange={(e) => updateSignerInfo(e, partyIndex, signerIndex, 0)}
				validateStatus={validation.fields[0] && 'error'}
				help={validation.fields[0] && 'Este campo é obrigatório.'}>
				<Input
					value={fields[0].variable}
					style={{ textTransform: 'uppercase' }}
				/>
			</Form.Item>
			<Form.Item
				label="Variável do email"
				onChange={(e) => updateSignerInfo(e, partyIndex, signerIndex, 1)}
				validateStatus={validation.fields[1] && 'error'}
				help={validation.fields[1] && 'Este campo é obrigatório.'}>
				<Input
					value={fields[1].variable}
					style={{ textTransform: 'uppercase' }}
				/>
			</Form.Item>
			<Divider />
			<Form.Item
				label="Variável da âncora"
				onChange={(e) =>
					updateSignerInfo(e, partyIndex, signerIndex, 'anchor_string')
				}
				validateStatus={validation.anchor[0].anchor_string && 'error'}
				help={
					validation.anchor[0].anchor_string && 'Este campo é obrigatório.'
				}>
				<Input
					value={data.anchor[0].anchor_string}
					style={{ textTransform: 'uppercase' }}
				/>
			</Form.Item>
			<Form.Item label="Deslocamento em X" help="Máx. ±10">
				<InputNumber
					value={data.anchor[0].anchor_x_offset}
					formatter={(value) => `${value} pol`}
					parser={(value) => value.replace(/[pol ]{1,4}/g, '')}
					min={-10}
					max={10}
					step={0.1}
					onChange={(value) =>
						updateAnchorOffset(
							value,
							partyIndex,
							signerIndex,
							'anchor_x_offset'
						)
					}
				/>
			</Form.Item>
			<Form.Item label="Deslocamento em Y" help="Máx. ±10">
				<InputNumber
					defaultValue={data.anchor[0].anchor_y_offset}
					formatter={(value) => `${value} pol`}
					parser={(value) => value.replace(/[pol ]{1,4}/g, '')}
					min={-10}
					max={10}
					step={0.1}
					onChange={(value) =>
						updateAnchorOffset(
							value,
							partyIndex,
							signerIndex,
							'anchor_y_offset'
						)
					}
				/>
			</Form.Item>
		</Card>
	)
}

export default Signer

Signer.propTypes = {
	data: object,
	partyIndex: number,
	signerIndex: number,
	updateSignerInfo: func,
	validation: object,
}
