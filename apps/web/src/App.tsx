import { AuthProvider } from './bootstrap'
import { AuthFlow } from '@app/flows'


export default function App() {
  return (
    <AuthProvider>
      <AuthFlow />
    </AuthProvider>
  )
}