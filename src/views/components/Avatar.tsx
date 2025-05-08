"use client"

import React from "react"

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", fallback, className = "", size = "md" }) => {
  const [imgError, setImgError] = React.useState(!src)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      {!imgError && src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600">
          {fallback || (alt ? alt.charAt(0).toUpperCase() : "U")}
        </div>
      )}
    </div>
  )
}

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt = "Avatar",
  className = "",
  ...props
}) => {
  return src ? (
    <img src={src || "/placeholder.svg"} alt={alt} className={`h-full w-full object-cover ${className}`} {...props} />
  ) : null
}

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`h-full w-full flex items-center justify-center bg-gray-200 text-gray-600 ${className}`} {...props}>
      {children}
    </div>
  )
}
