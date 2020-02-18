// Libs
import React, { Component } from 'react'
import { connect } from 'react-redux'

// Styles
import './index.less'

// Containers or components
import Button from '../../components/Button'
import Input from '../../components/Input'

// Assets
import logo from '../../assets/logo.svg'

// Actions
import { changeEmail, changePassword, login } from './actions'

class Login extends Component {
  componentDidMount() {
    // const { login } = this.props

    // login('gabrielpn@gmail.com', '123')
  }

  handleSubmit = e => {
    const { email, password, login } = this.props

    login(email, password)

    e.preventDefault()
  }

  render() {
    const { email, password, changeEmail, changePassword } = this.props
    const { handleSubmit } = this

    return (
      <div className="login">
        <div className="login__wrapper">
          <img className="login__logo" src={logo} alt="Logo" />
          <form
            className="login__form"
            onSubmit={handleSubmit}>
            <Input
              value={email}
              placeholder="Email"
              onChange={e => changeEmail(e.target.value)} />
            <Input
              type="password"
              value={password}
              placeholder="Senha"
              onChange={e => changePassword(e.target.value)} />
            <Button type="submit">Entrar</Button>
          </form>
        </div>
        <div className="login__background"/>
      </div>
    )
  }
}

Login = connect(
  state => {
    return {
      email: state.login.email,
      password: state.login.password
    }
  },
  { changeEmail, changePassword, login }
)(Login)

export default Login
