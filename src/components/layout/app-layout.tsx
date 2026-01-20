// Main app layout with header, sidebar, footer
import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { Footer } from './footer'

export const AppLayout = () => (
  <div className="min-h-screen">
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
)