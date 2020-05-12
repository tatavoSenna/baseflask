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
    <p>
        Bem vindo, {user.name} {user.surname}
      </p>
      <p>
        <a
          onClick={() => {
            window.location.assign(
              process.env.REACT_APP_DOCUSIGN_OAUTH_URL +
                "/auth?response_type=code&scope=signature&client_id=" +
                process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY +
                "&redirect_uri=" +
                process.env.REACT_APP_DOCUSIGN_REDIRECT_URL
            );
          }}
        >
          Docusign Auth
        </a>
      </p>
      <p>
        <a onClick={handleLogout}>Sair</a>
      </p>
    </div>
    <Menu
      className={isSideBarActived ? "header__menu header__menu--active" : "header__menu"}
      size={27}
      onClick={handleSideBar} />
  </div>
)

export default Header
