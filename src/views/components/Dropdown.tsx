"use client"

import React, { useState, useEffect, useRef } from "react"

// Dropdown menu components
interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className = "" }) => {
  return <div className={`relative inline-block text-left ${className}`}>{children}</div>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, asChild = false }) => {
  const [id] = useState(`dropdown-trigger-${Math.random().toString(36).substr(2, 9)}`)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      "aria-haspopup": "true",
      "data-dropdown-trigger": id,
    })
  }

  return (
    <button type="button" aria-haspopup="true" data-dropdown-trigger={id}>
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: "start" | "end" | "center"
  className?: string
  forceMount?: boolean
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = "center",
  className = "",
  forceMount = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const trigger = target.closest("[data-dropdown-trigger]")

      if (trigger) {
        setIsOpen((prev) => !prev)
        return
      }

      if (ref.current && !ref.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  if (!isOpen && !forceMount) return null

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${alignClasses[align]} ${className}`}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  disabled?: boolean
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      role="menuitem"
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  )
}

export const DropdownMenuLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`px-4 py-2 text-sm font-medium text-gray-900 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const DropdownMenuSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => {
  return <div className={`h-px my-1 bg-gray-200 ${className}`} role="separator" {...props} />
}
