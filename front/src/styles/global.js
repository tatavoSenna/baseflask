//import 'normalize.css'
import { createGlobalStyle } from 'styled-components'

import colors from './colors'
import fonts from './fonts'

import RobotoThin from '../assets/fonts/roboto/Roboto-Thin.ttf'
import RobotoThinItalic from '../assets/fonts/roboto/Roboto-ThinItalic.ttf'

import RobotoLight from '../assets/fonts/roboto/Roboto-Light.ttf'
import RobotoLightItalic from '../assets/fonts/roboto/Roboto-LightItalic.ttf'

import RobotoRegular from '../assets/fonts/roboto/Roboto-Regular.ttf'
import RobotoItalic from '../assets/fonts/roboto/Roboto-Italic.ttf'

import RobotoMedium from '../assets/fonts/roboto/Roboto-Medium.ttf'
import RobotoMediumItalic from '../assets/fonts/roboto/Roboto-MediumItalic.ttf'

import RobotoBold from '../assets/fonts/roboto/Roboto-Bold.ttf'
import RobotoBoldItalic from '../assets/fonts/roboto/Roboto-BoldItalic.ttf'

import RobotoBlack from '../assets/fonts/roboto/Roboto-Black.ttf'
import RobotoBlackItalic from '../assets/fonts/roboto/Roboto-BlackItalic.ttf'

const GlobalStyle = createGlobalStyle`
  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoThin}) format('truetype');
    font-weight: ${fonts.roboto.thin};
    font-style: normal;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoThinItalic}) format('truetype');
    font-weight: ${fonts.roboto.thin};
    font-style: italic;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoLight}) format('truetype');
    font-weight: ${fonts.roboto.light};
    font-style: normal;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoLightItalic}) format('truetype');
    font-weight: ${fonts.roboto.light};
    font-style: italic;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoRegular}) format('truetype');
    font-weight: ${fonts.roboto.regular};
    font-style: normal;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoItalic}) format('truetype');
    font-weight: ${fonts.roboto.regular};
    font-style: italic;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoMedium}) format('truetype');
    font-weight: ${fonts.roboto.medium};
    font-style: normal;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoMediumItalic}) format('truetype');
    font-weight: ${fonts.roboto.medium};
    font-style: italic;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoBold}) format('truetype');
    font-weight: ${fonts.roboto.bold};
    font-style: normal;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoBoldItalic}) format('truetype');
    font-weight: ${fonts.roboto.bold};
    font-style: italic;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoBlack}) format('truetype');
    font-weight: ${fonts.roboto.black};
    font-style: normal;
  }

  @font-face{
    font-family: ${fonts.roboto.name};
    src: local(${fonts.roboto.name}),
      url(${RobotoBlackItalic}) format('truetype');
    font-weight: ${fonts.roboto.black};
    font-style: italic;
  }

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
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
		height: 100%;
  }

  body {
		height: 100%;
    color: ${colors.black};	
    font-family: ${fonts.roboto.name};
    font-weight: ${fonts.roboto.regular};
    margin: 0;
    background-color: ${colors.white};
    font-size: 16px;
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
