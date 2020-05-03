import React from 'react'
import {useSelector, useDispatch} from 'react-redux'


import Button from '../Button'
import {CLOSE_DIALOG, CLOSE_DIALOG_WITH_ACTION} from './actions'
import "./index.less";



const Dialog = (props) => {

    const dispatch = useDispatch()

    const is_open = useSelector((state) => state.dialog.isOpen)
    const message = useSelector((state) => state.dialog.message)
    const cancelLabel = useSelector((state) => state.dialog.cancelLabel)
    const actionData = useSelector((state) => state.dialog.actionData)
    const actionLabel = useSelector((state) => state.dialog.actionLabel)

    if (is_open) {
        return (
            <div className="dialog__wrapper">
            <div className="dialog__overlay" />
            <div className="dialog__content">
                {message}
                <div>
                    <Button
                    children={cancelLabel}
                    onClick={() => dispatch({type:CLOSE_DIALOG})}
                    ></Button>
                    {actionData && (
                        <Button
                            children={actionLabel}
                            onClick={() => dispatch({type: CLOSE_DIALOG_WITH_ACTION, payload: actionData})}
                        ></Button>
                        )}
                </div>
            </div>
            </div>
        )
    } else {
        return null
    }
}

export default Dialog