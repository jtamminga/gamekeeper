import { RouterContainer } from './Router'
import { AuthProvider } from './bootstrap'
import { AuthFlow } from './AuthFlow'


export default function App() {
  return (
    <AuthProvider>
      <RouterContainer>
        <AuthFlow />
      </RouterContainer>
    </AuthProvider>
  )
}