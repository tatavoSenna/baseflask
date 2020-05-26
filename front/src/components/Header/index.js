// Libs
import React from 'react'
import {  Menu, Dropdown  } from 'antd';
import { DownOutlined } from '@ant-design/icons'


// Styles
import "./styles.less"
import 'antd/dist/antd.css';

// Assets
import logo from '../../assets/logo.svg';

function get_menu(handleLogout) {
  return(
  <Menu>
    <Menu.Item>
      <a onClick={() => {
            window.location.assign(
              process.env.REACT_APP_DOCUSIGN_OAUTH_URL +
              "/auth?response_type=code&scope=signature&client_id=" +
              process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY +
              "&redirect_uri=" +
              process.env.REACT_APP_DOCUSIGN_REDIRECT_URL
            );
          }}
        >
          Docusign connect
        </a>
    </Menu.Item>
    <Menu.Item>
      <a onClick={handleLogout}>Sair</a>
    </Menu.Item>
  </Menu>);
}

const Header = ({ user, isSideBarActived, handleSideBar, handleLogout, children, ...props }) => (
  <div className="header">
    <img className="header__logo" src={logo} alt="Logo" />
    <Dropdown overlay={get_menu(handleLogout)}>
    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
    {user.name} {user.surname} <DownOutlined />
    </a>
  </Dropdown>
  </div>
)

export default Header
