import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import Destinations from './components/Destinations/Destinations'
import ChatPreview from './components/ChatPreview/ChatPreview'
import Testimonials from './components/Testimonials/Testimonials'
import Newsletter from './components/Newsletter/Newsletter'
import Footer from './components/Footer/Footer'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

type Page = 'home' | 'login' | 'signup'

function AppInner() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'login') return <LoginPage onNavigate={setPage} />
  if (page === 'signup') return <SignUpPage onNavigate={setPage} />

  return (
    <>
      <Navbar onNavigate={setPage} />
      <Hero />
      <Features />
      <Destinations />
      <ChatPreview />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
