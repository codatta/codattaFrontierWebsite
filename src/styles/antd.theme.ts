import { theme, ThemeConfig } from 'antd'

const themeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#875DFF'

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
    Modal: {
      contentBg: '#1C1C26',
      colorBgMask: 'rgba(0,0, 0, 0.8)',
      borderRadiusLG: 24
    }
  }
}

export default themeConfig
