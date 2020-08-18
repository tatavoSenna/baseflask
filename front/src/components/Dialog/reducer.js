import {OPEN_DIALOG, CLOSE_DIALOG} from "./actions"

export default function (state = {
    isOpen: false,
    message: "",
    cancelLabel: "",
    actionData: "",
    actionLabel: ""
  }, action) {
    switch (action.type) {

        case OPEN_DIALOG:
            const { message, cancelLabel, actionData, actionLabel } = action.payload
            return {
                ...state,
                isOpen: true,
                message,
                cancelLabel,
                actionData,
                actionLabel,
            }

        case CLOSE_DIALOG:
            return {...state, isOpen: false}
        
        default:
            return state
    }
  }
  