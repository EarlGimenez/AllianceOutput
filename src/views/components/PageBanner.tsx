import type React from "react"
import { Box, Typography, Container } from "@mui/material"

interface PageBannerProps {
  imageSrc: string
  imageAlt: string
  header: string
  subheader?: string
  height?: { xs?: string; sm?: string; md?: string; lg?: string; xl?: string } | string
  overlayColor?: string
  textColor?: string
  textAlign?: "left" | "center" | "right"
}

export const PageBanner: React.FC<PageBannerProps> = ({
  imageSrc,
  imageAlt,
  header,
  subheader,
  height = { xs: "200px", md: "300px" },
  overlayColor = "rgba(0,0,0,0.4)",
  textColor = "white",
  textAlign = "center",
}) => {
  return (
    <Box
      sx={{
        height: height,
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={imageAlt}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: overlayColor,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: textColor,
              fontWeight: "bold",
              textAlign: textAlign,
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              mb: subheader ? 2 : 0,
            }}
          >
            {header}
          </Typography>

          {subheader && (
            <Typography
              variant="h5"
              sx={{
                color: textColor,
                textAlign: textAlign,
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                maxWidth: "800px",
                mx: textAlign === "center" ? "auto" : 0,
              }}
            >
              {subheader}
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  )
}
