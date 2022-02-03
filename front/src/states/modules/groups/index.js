import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	loaded: false,
	groupsList: [],
	showGroupModal: false,
	newGroup: {
		name: '',
	},
}

const { actions, reducer } = createSlice({
	name: 'groups',
	initialState,
	reducers: {
		clearGroupsData: (state) => extend(state, initialState),
		getGroupList: (state) =>
			extend(state, {
				loading: true,
				loaded: false,
				groupsList: [],
			}),
		getGroupListSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				loaded: true,
				groupsList: payload,
			}),
		updateNewGroup: (state, { payload }) =>
			extend(state, {
				newGroup: extend(state.newGroup, {
					name: payload.name,
				}),
			}),
		createGroup: (state) => extend(state),
		resetNewGroup: (state) =>
			extend(state, {
				newGroup: extend(state.newGroup, {
					name: '',
				}),
			}),
		setShowGroupModal: (state, { payload }) =>
			extend(state, {
				showGroupModal: payload,
			}),
		deleteGroup: (state) => extend(state),
	},
})

export const {
	getGroupList,
	getGroupListSuccess,
	createGroup,
	deleteGroup,
	setShowGroupModal,
	updateNewGroup,
	resetNewGroup,
	clearGroupsData,
} = actions

export { default as groupsSaga } from './sagas'

export default reducer
