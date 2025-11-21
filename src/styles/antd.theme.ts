import { theme, ThemeConfig } from 'antd'

const themeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#875DFF',
    boxShadow: 'none',
    colorSuccess: '#00C165',
    colorInfo: '#0A77FF',
    colorLink: '#875DFF',
    // colorBgBase: '#1C1C26',
    borderRadius: 6,
    colorBorder: '#404049',
    colorLinkHover: '#ffffff80'

    // screenXS: 0,
    // screenXSMax: 576,
    // screenXSMin: 0,

    // screenSM: 640,
    // screenSM: 640,

    // screenMD: 768,
    // screenLG: 1024,
    // screenXL: 1280,
    // screenXXL: 1536
  },
  components: {
    Button: {
      primaryShadow: 'none',
      fontSizeLG: 14,
      boxShadow: 'none'
    },
    Input: {
      colorBgContainer: 'transparent'
    },
    Modal: {
      contentBg: '#1C1C26',
      colorBgMask: 'rgba(0,0, 0, 0.8)',
      borderRadiusLG: 24
    },
    Select: {
      colorBgContainer: 'transparent'
    },
    DatePicker: {
      colorBgContainer: 'transparent'
    }
  }
}

export default themeConfig
