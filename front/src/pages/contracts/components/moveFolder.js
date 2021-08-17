import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Tree, Spin, Empty } from 'antd'
import PropTypes from 'prop-types'
import {
	listFolder,
	setSelectChildren,
	setResetFolders,
} from '~/states/modules/folder'

const MoveFolderModal = ({
	handleCancel,
	showModal,
	handleMoveFolder,
	parent,
	chosenMoveRow,
}) => {
	const dispatch = useDispatch()
	const { folders, loading } = useSelector(({ folder }) => folder)
	const [destination, setDestination] = useState(null)
	const [moveUnable, setMoveUnable] = useState(true)

	function onLoadData(node) {
		return new Promise((resolve) => {
			if (node.children) {
				resolve()
				return
			}
			dispatch(setSelectChildren({ parent: node.id }))
			setTimeout(() => {
				resolve()
			}, 1000)
		})
	}

	const handleCalcelButton = () => {
		handleCancel(false)
		setMoveUnable(true)
	}

	const handleMoveButton = () => {
		setMoveUnable(true)
		handleMoveFolder({ destination, parent })
	}

	const onSelect = (selectedKeys, e) => {
		if (e.selected) {
			setMoveUnable(false)
		} else {
			setMoveUnable(true)
		}
		if (selectedKeys[0] === 'documentos') {
			setDestination()
		} else {
			setDestination(selectedKeys)
		}
	}

	const handleResetFolder = () => {
		dispatch(setResetFolders())
	}

	useEffect(() => {
		if (parent) {
			dispatch(listFolder({ id: chosenMoveRow.id, source: true }))
		} else {
			dispatch(listFolder({ id: chosenMoveRow.id }))
		}
		setDestination(null)
	}, [dispatch, parent, chosenMoveRow])

	const buttonDisplay = () => {
		if (loading) {
			return null
		}

		if (!folders.length && !loading) {
			return [
				<Button key="cancel" onClick={() => handleCalcelButton()}>
					OK
				</Button>,
			]
		}
		return [
			<Button key="cancel" onClick={() => handleCalcelButton()}>
				Cancelar
			</Button>,
			<Button
				key="move"
				disabled={moveUnable}
				onClick={() => handleMoveButton()}>
				Mover
			</Button>,
		]
	}

	return (
		<Modal
			visible={showModal}
			onCancel={() => handleCalcelButton()}
			destroyOnClose={true}
			afterClose={handleResetFolder}
			title={`Selecione um novo diretório para ${chosenMoveRow.title}`}
			footer={buttonDisplay()}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 10,
				}}>
				<Spin spinning={!folders.length && loading} />
				{!folders.length && !loading ? (
					<Empty
						description="Sem pastas para mover"
						style={{ marginBottom: '1rem' }}
					/>
				) : null}
			</div>
			<Tree
				loadData={onLoadData}
				treeData={folders}
				defaultExpandedKeys={['documentos']}
				onSelect={onSelect}
			/>
		</Modal>
	)
}

MoveFolderModal.propTypes = {
	handleCancel: PropTypes.func,
	showModal: PropTypes.bool,
	children: PropTypes.array,
	folders: PropTypes.array,
	handleUpdateChildren: PropTypes.func,
	chosenMoveId: PropTypes.number,
	parent: PropTypes.number,
	handleMoveFolder: PropTypes.func,
	chosenMoveRow: PropTypes.object,
}

export default MoveFolderModal
