// Libs
import React from 'react'
import { Menu } from 'react-feather'

// Styles
import "./styles.less"

// Assets
import logo from '../../assets/logo.svg'

const Header = ({ user, isSideBarActived, handleSideBar, handleLogout, children, ...props }) => (
  <div className="header">
    <img className="header__logo" src={logo} alt="Logo" />
    <div>
      <p>{user.name} {user.surname}</p>
      <p>Bem vindo, <a onClick={handleLogout}>sair</a></p>
    </div>
    <Menu
      className={isSideBarActived ? "header__menu header__menu--active" : "header__menu"}
      size={27}
      onClick={handleSideBar} />
  </div>
)

export default Header
