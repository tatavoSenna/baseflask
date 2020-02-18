// Libs
import React from 'react'
import classNames from 'classnames'

// Styles
import "./styles.less"

const Button = ({ width, height, disabled, children, ...props }) => {
  const buttonStyle = {
    width,
    height
  }

  const buttonClassName = classNames(
    'button',
    {
      'button--disabled': disabled
    }
  )

  return (
    <button
      style={buttonStyle}
      className={buttonClassName}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  )
}

export default Button
