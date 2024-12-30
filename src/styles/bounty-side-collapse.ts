import { ThemeConfig, theme } from 'antd'

const AntdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#875DFF',
    // colorError: '#D92B2B',
    boxShadow: 'none',
    colorSuccess: '#00C165',
    colorInfo: '#0A77FF',
    colorLink: '#875DFF',
    colorBgBase: '#1C1C26',
    borderRadius: 8,
    colorBorder: '#404049',
    colorLinkHover: '#ffffff80'
  },
  components: {
    Collapse: {
      padding: 0,
      paddingLG: 0
    }
  }
}

export default AntdTheme
