"use client"

import React, { useState } from "react"
import { Box, Typography, Switch, Container, Divider } from "@mui/material"
import { styled } from "@mui/material/styles"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PageBanner } from "../../components/PageBanner"

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 0,
  display: "flex",
  "&:active .MuiSwitch-thumb": {
    width: 28,
    height: 28,
  },
  "& .MuiSwitch-switchBase": {
    padding: 4,
    "&.Mui-checked": {
      transform: "translateX(26px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#34c759",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#ffffff",
    width: 28,
    height: 28,
    borderRadius: "50%",
    boxShadow: "inset 0 0 3px rgba(0,0,0,0.3)",
    transform: "translateY(-1px)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 34 / 2,
    backgroundColor: "#d0d0d0",
    opacity: 1,
    transition: theme.transitions.create(["background-color"]),
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
  },
}))

const SettingToggle = ({
  label,
  checked,
  onChange,
  id,
}: {
  label: string
  checked: boolean
  onChange: (val: boolean) => void
  id: string
}) => (
  <Box className="flex justify-between items-center py-2">
    <Typography className="text-[#205781]">{label}</Typography>
    <CustomSwitch
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </Box>
)

const SettingsPage: React.FC = () => {
  const [desktopNotifications, setDesktopNotifications] = useState(true)
  const [taskbarFlashing, setTaskbarFlashing] = useState(true)
  const [notificationSounds, setNotificationSounds] = useState(true)
  const [hideUserDetails, setHideUserDetails] = useState(true)
  const [largerText, setLargerText] = useState(true)

  return (
    <Box className="min-h-screen flex flex-col bg-gray-50">
      <LandingNav />

      <Container maxWidth={false} disableGutters className="flex flex-row gap-6 py-10 px-10">
        {/* Sidebar */}
        <Box className="w-1/4 bg-[#d2e4ff] p-6 rounded-xl shadow">
          <Typography
            sx={{ color: "#0b2742", mt: 4, ml: 4 }}
            fontWeight="bold"
            fontSize="1.35rem"
          >
            Settings and<br />
            Preferences
          </Typography>
        </Box>

        {/* Settings Panel */}
        <Box className="w-full lg:w-3/4 space-y-8 bg-white p-6 rounded-xl shadow">
          {/* Notifications */}
          <Box sx={{ mt: 4, ml: 6, mr: 14, mb: 4 }}>
            <Typography sx={{ color: "#2b5f87", mb: 3.5 }} fontWeight="bold" fontSize="1.35rem" className="mb-2">
              Notifications
            </Typography>
            <Box sx={{ mb: 3.5 }}>
              <SettingToggle
                label="Enable Desktop Notifications"
                checked={desktopNotifications}
                onChange={setDesktopNotifications}
                id="desktop-notifications"
              />
            </Box>
            <Box sx={{ mb: 3.5 }}>
              <SettingToggle
                label="Enable Taskbar Flashing"
                checked={taskbarFlashing}
                onChange={setTaskbarFlashing}
                id="taskbar-flashing"
              />
            </Box>
            <Box sx={{ mb: 3.5 }}>
              <SettingToggle
                label="Enable Notification Sounds"
                checked={notificationSounds}
                onChange={setNotificationSounds}
                id="notification-sounds"
              />
            </Box>
          </Box>
          <Divider className="!bg-[#d2e4ff] mb-4 h-[4px]" />
          {/* Preferences */}
          <Box sx={{ mt: 4, ml: 6, mr: 14, mb: 14 }}>
            <Typography sx={{ color: "#2b5f87", mb: 3.5 }} fontWeight="bold" fontSize="1.35rem" className="mb-2">
              Preferences
            </Typography>
            <Box sx={{ mb: 3.5 }}>
              <SettingToggle
                label="Privacy - Hide User Details from Others"
                checked={hideUserDetails}
                onChange={setHideUserDetails}
                id="hide-user-details"
              />
            </Box>
            <Box sx={{ mb: 3.5 }}>
              <SettingToggle
                label="Enable Larger Text"
                checked={largerText}
                onChange={setLargerText}
                id="larger-text"
              />
            </Box>
          </Box>
        </Box>
      </Container>

      <PageBanner
        imageSrc="https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg"
        imageAlt="Meeting Room"
        header="BookIt"
        subheader="Your Meeting Reservation Platform"
        textAlign="center"
      />

      <SiteFooter />
    </Box>
  )
}

export default SettingsPage
