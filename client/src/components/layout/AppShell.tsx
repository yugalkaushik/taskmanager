import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden text-slate-900">
      <div className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">TaskManager</p>
            <p className="text-[11px] text-slate-400">Team workspace</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close menu backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-900/35"
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] p-3">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="hidden p-3 pr-0 md:flex md:w-[18rem] md:shrink-0 md:p-3 md:pr-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-3 pb-7 pt-20 md:pr-5 md:pl-0 md:py-8">
          <div className="section-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}