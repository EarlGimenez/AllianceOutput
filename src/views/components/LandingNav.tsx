"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Button from "./Button"

// Icon components (temporarily using inline SVGs - adjust based on your icon library)
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
)

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
)

export function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: "Homepage", href: "/" },
    { name: "Calendar", href: "/calendar" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="site-header bg-[#1e5393] text-white">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Bookit
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4 mr-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={
                  isActive(item.href)
                    ? "bg-[#725188] text-white px-4 py-2 rounded-md font-medium"
                    : "px-4 py-2 hover:text-opacity-80"
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button asChild variant="secondary" size="sm">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/sign-up">Register</Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none text-white">
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[100px] left-0 right-0 bg-[#1e5393] z-50 border-b border-white/20 py-4 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block py-2 px-4 ${
                isActive(item.href) ? "bg-[#725188] text-white rounded-md" : "text-white hover:text-opacity-80"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-2">
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link to="/sign-up">Register</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
