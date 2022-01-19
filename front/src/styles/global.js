//import 'normalize.css'
import { createGlobalStyle } from 'styled-components'

import colors from './colors'
import fonts from './fonts'

const GlobalStyle = createGlobalStyle`

	#root {
		height: 100%;
	}

  :root {

    --amplify-components-button-primary-border-color: #1890ff;
    --amplify-components-button-primary-background-color: #1890ff;
    --amplify-components-button-primary-hover-background-color: #40a9ff;
    --amplify-components-button-primary-active-background-color: #096dd9;
    --amplify-components-button-primary-focus-background-color: #40a9ff;
    --amplify-components-button-primary-focus-box-shadow: none;
    --amplify-components-button-border-radius: 2px;

    --amplify-components-button-hover-border-color: #40a9ff;
    --amplify-components-button-hover-background-color: #fafafa;
    --amplify-components-button-active-border-color: #096dd9;
    --amplify-components-button-active-background-color: #fafafa;
    --amplify-components-button-focus-border-color: #40a9ff;
    --amplify-components-button-focus-background-color: #fafafa;
    --amplify-components-button-focus-box-shadow: none;
    
    --amplify-components-button-link-color: #1890ff;
    --amplify-components-button-link-hover-color: #40a9ff;
    --amplify-components-button-link-hover-background-color: #fafafa;
    --amplify-components-button-link-active-background-color: #e6f7ff;
    --amplify-components-button-link-focus-background-color: #e6f7ff;

    --amplify-components-tabs-item-hover-color: #1890ff;
    --amplify-components-tabs-item-active-color: #00404d;
    --amplify-components-tabs-item-active-border-color: #1890ff;

    --amplify-components-fieldcontrol-border-color: #d9d9d9;
    --amplify-components-fieldcontrol-border-width: 1px;
    --amplify-components-fieldcontrol-border-radius: 2px;
    --amplify-components-fieldcontrol-focus-border-color: #40a9ff;
    --amplify-components-fieldcontrol-focus-box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }

  html {
    font-size: 16px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
		height: 100%;
  }

  body {
		height: 100%;
    color: ${colors.black};
    font-family: ${fonts.sans.name}, sans-serif;
    margin: 0;
    background-color: ${colors.white};
  }

  a {
    color: inherit;
		text-decoration: none;
  }

	input {
		outline: none;
	}

  button,
  summary {
    cursor: pointer;
  }

`

export default GlobalStyle
