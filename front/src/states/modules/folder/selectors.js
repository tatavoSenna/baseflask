import update from 'immutability-helper'

export const addFolderSelector = (folders, payload) => {
	const foldersUpdated = update(folders, { $push: [payload] })
	return foldersUpdated
}

export const removeFolder = (folders, index) => {
	let test = folders
	test.length = index + 1
	return test
}

export const selectFolders = (payload, id) => {
	const listAllFolders = payload.map((folder) => ({
		id: parseInt(folder.id, 10),
		key: parseInt(folder.id, 10),
		title: folder.title,
		is_folder: folder.is_folder,
		parent_id: folder.parent_id,
	}))
	const listFolders = listAllFolders.filter((list) => list.id !== id)
	return listFolders
}

export const selectFoldersSource = (payload, id) => {
	const listAllFolders = payload.map((folder) => ({
		id: parseInt(folder.id, 10),
		key: parseInt(folder.id, 10),
		title: folder.title,
		is_folder: folder.is_folder,
		parent_id: folder.parent_id,
	}))
	let listFolders = listAllFolders.filter((list) => list.id !== id)
	const listFoldersDocuments = [
		{
			id: 'documentos',
			key: 'documentos',
			title: 'documentos',
			is_folder: true,
			parent_id: null,
			children: listFolders,
		},
	]
	return listFoldersDocuments
}

export const addChildren = (folders, children, parent) => {
	const index = folders.findIndex((folder) => folder.id === parent)
	let newFolders = folders
	if (index < 0) {
		let i
		for (i = 0; i < newFolders.length; i++) {
			findNode(parent, children, newFolders[i])
		}
		return newFolders
	}
	newFolders[index] = { ...newFolders[index], children: children }
	return newFolders
}

function findNode(nodeId, json, node) {
	if (node.id === nodeId) {
		node.children = json
	} else {
		if (node.children) {
			for (var i = 0; i < node.children.length; i++) {
				findNode(nodeId, json, node.children[i])
			}
		}
	}
}
