"use client"
import Button from "./Button"

interface InfoCardProps {
  imageAlt: string
  imageSrc?: string
  title: string
  subtitle: string
  buttonText: string
  onButtonClick?: () => void
}

export function InfoCard({
  imageAlt,
  imageSrc = "/placeholder.svg",
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: InfoCardProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6 flex flex-col sm:flex-row gap-6">
      <div className="w-[160px] h-[160px] bg-gray-200 flex-shrink-0">
        <img
          src={imageSrc || `/placeholder.svg?text=${title.charAt(0)}`}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center flex-grow">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 mb-4">{subtitle}</p>
        <div>
          <Button onClick={onButtonClick} className="w-auto">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
