// Libs
import React from 'react'

// Styles
import "./styles.less"

const Radio = ({ value, options, onChange, ...props }) => {
  const optionsLength = options.length

  let radioStyle = {
    flexDirection: 'row',
  }

  let radioOptionStyle = {
    width: 'calc(50% - 10px)'
  }

  if(optionsLength > 2) {
    radioStyle = {
      flexDirection: 'column',
    }

    radioOptionStyle={
      width: '100%',
      marginBottom: '10px'
    }
  }

  return (
    <ul
      style={radioStyle}
      className="radio">
      {options.map(option => {
        return (
          <li
            style={radioOptionStyle}
            key={option.option}
            className={option.option === value ? "radio__option radio__option--active" : "radio__option"}
            onClick={() => onChange(option.option)}
            {...props}>
            {option.label}
          </li>
        )
      })}
    </ul>
  )
}

export default Radio
