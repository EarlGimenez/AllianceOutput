import React, { ReactElement, ReactNode } from "react"

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize    = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  className?: string
  children: ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size    = "default",
  className = "",
  asChild = false,
  children,
  ...props
}) => {
  // Determine variant classes
  let variantClasses = ""
  switch (variant) {
    case "default":   variantClasses = "bg-[#1e5393] text-white hover:bg-[#184377] transition-colors"; break
    case "outline":   variantClasses = "bg-transparent border border-[#1e5393] text-[#1e5393] hover:bg-[#1e5393]/10 transition-colors"; break
    case "secondary": variantClasses = "bg-[#f0f4f9] text-[#1e5393] hover:bg-[#e1eaf3] transition-colors"; break
    case "ghost":     variantClasses = "bg-transparent text-[#1e5393] hover:bg-[#1e5393]/10 transition-colors"; break
    case "link":      variantClasses = "bg-transparent text-[#1e5393] hover:underline transition-colors p-0"; break
  }

  // Determine size classes
  let sizeClasses = ""
  switch (size) {
    case "default": sizeClasses = "h-10 px-4 py-2"; break
    case "sm":      sizeClasses = "h-8 px-3 py-1 text-sm"; break
    case "lg":      sizeClasses = "h-12 px-6 py-3 text-lg"; break
    case "icon":    sizeClasses = "h-10 w-10 p-2"; break
  }

  // If rendering a custom child, clone it with merged classes
  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<any, any>
    // Safely pull any existing className off the child
    const existing = (child.props as any).className || ""
    const merged = [
      "font-medium rounded-md inline-flex items-center justify-center",
      variantClasses,
      sizeClasses,
      className,
      existing,
    ].filter(Boolean).join(" ")

    // TS needs a little help here—cast to any so cloneElement accepts className
    return React.cloneElement(child, { ...props, className: merged } as any)
  }

  // Default: render as a <button>
  return (
    <button
      className={[
        "font-medium rounded-md inline-flex items-center justify-center",
        variantClasses,
        sizeClasses,
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
