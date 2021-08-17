import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import {
	addFolderSelector,
	removeFolder,
	selectFolders,
	addChildren,
	selectFoldersSource,
} from './selectors'

const initialState = {
	folders: [],
	children: [],
	link: '',
	error: null,
	loading: false,
	showFolderModal: false,
	newFolder: {
		title: '',
	},
	accessFolders: [],
	moveFolderModal: false,
	moveFolderId: null,
}

const { actions, reducer } = createSlice({
	name: 'folder',
	initialState,
	reducers: {
		listFolder: (state, { payload }) => {
			extend(state, {
				loading: true,
				moveFolderId: payload.id,
			})
		},
		listFolderSuccess: (state, { payload }) => {
			extend(state, {
				folders: selectFolders(payload.items, state.moveFolderId),
				error: null,
				loading: false,
			})
		},
		listFolderFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		createFolder: (state) =>
			extend(state, {
				loading: true,
				showModal: false,
			}),
		createFolderSuccess: (state, { payload }) =>
			extend(state, {
				link: payload.link,
				showFolderModal: false,
				error: null,
				loading: false,
			}),
		createFolderFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		setShowModalFolder: (state, { payload }) =>
			extend(state, {
				showFolderModal: payload,
			}),
		setChooseFolder: (state, { payload }) => {
			extend(state, {
				accessFolders: addFolderSelector(state.accessFolders, payload),
			})
		},
		setInitialFolder: (state) => {
			extend(state, {
				accessFolders: [],
			})
		},
		setRollBackFolder: (state, { payload }) => {
			extend(state, {
				accessFolders: removeFolder(state.accessFolders, payload),
			})
		},
		updateNewFolder: (state, { payload }) => {
			extend(state, {
				newFolder: extend(state.newFolder, {
					title: payload.title,
				}),
			})
		},
		resetNewFolder: (state) => {
			extend(state, {
				newFolder: extend(state.newFolder, {
					title: '',
				}),
			})
		},
		setMoveFolderModal: (state, { payload }) =>
			extend(state, {
				moveFolderModal: payload,
			}),
		setSelectChildren: (state) => {
			extend(state, {
				loading: true,
			})
		},
		setSelectChildrenSuccess: (state, { payload }) => {
			extend(state, {
				children: selectFolders(payload.items, state.moveFolderId),
				folders: addChildren(
					state.folders,
					selectFolders(payload.items, state.moveFolderId),
					payload.parent
				),
				error: null,
				loading: false,
			})
		},
		setSelectChildrenFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		setMoveFolder: (state) => {
			extend(state, {
				loading: true,
			})
		},
		setMoveFolderSuccess: (state) => {
			extend(state, {
				error: null,
				loading: false,
				moveFolderModal: false,
			})
		},
		setMoveFolderFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
				moveFolderModal: false,
			}),
		setResetFolders: (state) => {
			extend(state, {
				folders: [],
			})
		},
		listFoldersSource: (state, { payload }) => {
			extend(state, {
				folders: selectFoldersSource(payload.items, state.moveFolderId),
				error: null,
				loading: false,
			})
		},
	},
})

export const {
	listFolder,
	listFolderSuccess,
	listFolderFailure,
	createFolder,
	createFolderSuccess,
	createFolderFailure,
	setShowModalFolder,
	setChooseFolder,
	setInitialFolder,
	setRollBackFolder,
	updateNewFolder,
	resetNewFolder,
	setMoveFolderModal,
	setSelectChildren,
	setSelectChildrenSuccess,
	setSelectChildrenFailure,
	setMoveFolder,
	setMoveFolderSuccess,
	setMoveFolderFailure,
	setResetFolders,
	listFoldersSource,
} = actions

export { default as folderSaga } from './sagas'

export default reducer
