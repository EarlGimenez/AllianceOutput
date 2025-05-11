"use client"

import React, { useState } from "react"
import { Box, Typography, Switch, Paper, Divider, Grid, Container } from "@mui/material"
import { LandingNav } from "../../components/LandingNav";
import { SiteFooter } from "../../components/SiteFooter";
import { PageBanner } from "../../components/PageBanner";

const SettingsPage: React.FC = () => {
  const [desktopNotifications, setDesktopNotifications] = useState(true)
  const [taskbarFlashing, setTaskbarFlashing] = useState(true)
  const [notificationSounds, setNotificationSounds] = useState(true)
  const [hideUserDetails, setHideUserDetails] = useState(true)
  const [largerText, setLargerText] = useState(true)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'gray.50',
      }}
    >


      <LandingNav />

      <Container maxWidth="xl" className="flex flex-col lg:flex-row gap-6 py-10">
        {/* Sidebar */}
        <Box className="w-full lg:w-1/4 bg-blue-100 p-6 rounded-xl shadow">
          <Typography variant="h6" className="text-blue-900 font-bold">
            {/* Settings and Preferences */}
          </Typography>
        </Box>

        {/* Main Settings Content */}
        <Box className="w-full lg:w-3/4 space-y-8">
          {/* Notifications Section */}
          <Paper elevation={1} className="p-6 rounded-xl shadow">
            <Typography variant="h4" className="text-blue-600 mb-4">
              Notifications
            </Typography>
            <Divider className="mb-4" />
            <Grid container spacing={4}>
              {[
                {
                  label: "Enable Desktop Notifications",
                  checked: desktopNotifications,
                  onChange: setDesktopNotifications,
                  id: "desktop-notifications",
                },
                {
                  label: "Enable Taskbar Flashing",
                  checked: taskbarFlashing,
                  onChange: setTaskbarFlashing,
                  id: "taskbar-flashing",
                },
                {
                  label: "Enable Notification Sounds",
                  checked: notificationSounds,
                  onChange: setNotificationSounds,
                  id: "notification-sounds",
                },
              ].map((setting) => (
                <Grid
                  item
                  xs={12}
                  key={setting.id}
                  className="flex justify-between items-center"
                >
                  <Typography className="text-blue-500 font-medium">
                    {setting.label}
                  </Typography>
                  <Switch
                    id={setting.id}
                    checked={setting.checked}
                    onChange={(e) => setting.onChange(e.target.checked)}
                    color="success"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Preferences Section */}
          <Paper elevation={1} className="p-6 rounded-xl shadow">
            <Typography variant="h6" className="text-blue-600 mb-4">
              Preferences
            </Typography>
            <Divider className="mb-4" />
            <Grid container spacing={4}>
              {[
                {
                  label: "Privacy - Hide User Details from Others",
                  checked: hideUserDetails,
                  onChange: setHideUserDetails,
                  id: "hide-user-details",
                },
                {
                  label: "Enable Larger Text",
                  checked: largerText,
                  onChange: setLargerText,
                  id: "larger-text",
                },
              ].map((setting) => (
                <Grid
                  item
                  xs={12}
                  key={setting.id}
                  className="flex justify-between items-center"
                >
                  <Typography className="text-blue-500 font-medium">
                    {setting.label}
                  </Typography>
                  <Switch
                    id={setting.id}
                    checked={setting.checked}
                    onChange={(e) => setting.onChange(e.target.checked)}
                    color="success"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
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
