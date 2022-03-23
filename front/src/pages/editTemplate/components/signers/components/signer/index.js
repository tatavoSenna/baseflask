import React from 'react'
import { useDispatch } from 'react-redux'
import { object, func, number } from 'prop-types'
import { Form, Input, InputNumber, Badge, Divider } from 'antd'
import {
	editTemplateSignersInfo,
	editTemplateSignerRemove,
	editTemplateMove,
} from '~/states/modules/editTemplate'
import DragDropCard from '~/components/dragDropCard'
import Delete from '~/components/deleteConfirm'

const Signer = ({ data, partyIndex, signerIndex, updateSignerInfo }) => {
	const dispatch = useDispatch()
	const { fields } = data

	// Had to  create this function for the offset values because onChange with updateSignerInfo was not working properly with inputNumber arrows
	const updateAnchorOffset = (value, partyIndex, signerIndex, name) => {
		dispatch(editTemplateSignersInfo({ value, partyIndex, signerIndex, name }))
	}

	const handleRemoveSigner = () => {
		dispatch(editTemplateSignerRemove({ partyIndex, signerIndex }))
	}

	return (
		<DragDropCard
			move={editTemplateMove}
			name="signers"
			index={signerIndex}
			listIndex={partyIndex}
		>
			<Form.Item
				name={`title_${partyIndex}_${signerIndex}`}
				label="Título"
				onChange={(e) => updateSignerInfo(e, partyIndex, signerIndex, 'title')}
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			>
				<Input value={data.title} />
			</Form.Item>
			<Form.Item
				name={`name_${partyIndex}_${signerIndex}`}
				label="Variável do nome"
				onChange={(e) => updateSignerInfo(e, partyIndex, signerIndex, 0)}
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			>
				<Input
					value={fields[0].variable}
					style={{ textTransform: 'uppercase' }}
				/>
			</Form.Item>
			<Form.Item
				name={`email_${partyIndex}_${signerIndex}`}
				label="Variável do email"
				onChange={(e) => updateSignerInfo(e, partyIndex, signerIndex, 1)}
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			>
				<Input
					value={fields[1].variable}
					style={{ textTransform: 'uppercase' }}
				/>
			</Form.Item>
			<Divider />
			<Form.Item
				name={`anchor_${partyIndex}_${signerIndex}`}
				label="Variável da âncora"
				onChange={(e) =>
					updateSignerInfo(e, partyIndex, signerIndex, 'anchor_string')
				}
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			>
				<Input
					value={data.anchor[0].anchor_string}
					style={{ textTransform: 'uppercase' }}
				/>
			</Form.Item>
			<Form.Item
				name={`x_offset_${partyIndex}_${signerIndex}`}
				label="Deslocamento em X"
				help="Máx. ±10"
			>
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
			<Form.Item
				name={`y_offset_${partyIndex}_${signerIndex}`}
				label="Deslocamento em Y"
				help="Máx. ±10"
			>
				<InputNumber
					value={data.anchor[0].anchor_y_offset}
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
			<div
				style={{
					display: 'flex',
					background: 'rgba(230, 236, 245, 0.5)',
					height: '40px',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					margin: '25px -25px -10px -25px',
				}}
			>
				<Badge count={signerIndex + 1} style={{ background: '#1890ff' }} />
				<Divider
					type="vertical"
					style={{
						height: '20px',
						borderLeft: '1px solid #bdbdbd',
						marginTop: '2px',
					}}
				/>
				<Delete
					handle={() => handleRemoveSigner()}
					title="Deseja excluir esse assinante?"
				/>
			</div>
		</DragDropCard>
	)
}

export default Signer

Signer.propTypes = {
	data: object,
	partyIndex: number,
	signerIndex: number,
	updateSignerInfo: func,
}
