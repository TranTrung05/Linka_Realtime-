import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ChatAppPage from './pages/ChatAppPage'
import ProtectRoute from './components/auth/ProtectRoute'
function App() {
  
  return (
    <>
    <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* {Public Routes} */}
          <Route 
            path = '/signin'
            element = {<SignInPage />}
          />
          <Route
            path = '/signup'
            element = {<SignUpPage />}
          />
          
          {/* {Protected Routes} */}
          <Route element={<ProtectRoute />}>
            <Route
              path='/'
              element={<ChatAppPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
