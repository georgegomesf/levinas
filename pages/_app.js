import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContexts'
import { LivrosProvider } from 'contexts/LivrosContext'
import { SecaoProvider } from 'contexts/SecaoContext'
import { TextosProvider } from 'contexts/TextosContext'

function MyApp({ Component, pageProps }) {
  return <AuthProvider>
    <LivrosProvider>
      <TextosProvider>
        <SecaoProvider>
          <Component {...pageProps} />
        </SecaoProvider>      
      </TextosProvider>
    </LivrosProvider>
  </AuthProvider>
}

export default MyApp
