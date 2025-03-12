import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App'

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST as string,
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY as string}
      options={options}  
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
)
