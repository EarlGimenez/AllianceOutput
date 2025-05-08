interface PageBannerProps {
  title?: string
  subtitle?: string
  imageSrc?: string
}

export function PageBanner({
  title = "BookIt",
  subtitle = "Your Meeting Reservation Platform",
  imageSrc = "/placeholder.svg",
}: PageBannerProps) {
  return (
    <div className="relative h-[452px] w-full">
      {/* Image with dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <img src={imageSrc || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />

      {/* Text overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-xl md:text-2xl">{subtitle}</p>
      </div>
    </div>
  )
}
