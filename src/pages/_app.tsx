import '@/styles/globals.less'
import '@/styles/doc.less'
import 'prismjs/themes/prism.css'
import type { AppProps } from 'next/app'
import Layout from './components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return <Layout>
    <Component {...pageProps} />
  </Layout>
}
