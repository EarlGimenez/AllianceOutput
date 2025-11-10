"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography, Grid, Card, CardContent, Paper, useTheme, CircularProgress, Alert } from "@mui/material"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"
import PeopleIcon from "@mui/icons-material/People"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import { AdminSidebar } from "../../../components/AdminSidebar"
import { getDashboardStatistics, type DashboardStatistics } from "../../../services/dashboardService"

const AdminDashboard: React.FC = () => {
  const theme = useTheme()
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStatistics()
  }, [])

  const fetchDashboardStatistics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardStatistics()
      setStatistics(data)
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err)
      setError("Failed to load dashboard statistics. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const GaugeChart = ({ value, color, label }: { value: number; color: string; label: string }) => {
    return (
      <Box sx={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", px: 2 }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            sx={{ color: theme.palette.grey[200] }}
            size={120}
            thickness={6}
            value={100}
          />
          <CircularProgress
            variant="determinate"
            sx={{ color, position: "absolute", left: 0 }}
            size={120}
            thickness={6}
            value={value}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" component="div" color="text.secondary">
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {label}
        </Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <AdminSidebar>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <CircularProgress size={60} />
        </Box>
      </AdminSidebar>
    )
  }

  if (error || !statistics) {
    return (
      <AdminSidebar>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error || "Unable to load dashboard data"}</Alert>
        </Box>
      </AdminSidebar>
    )
  }

  return (
    <AdminSidebar>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your platform today.
          </Typography>
        </Box>

        <Box>
          {/* Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        {statistics.totalUsers}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        {statistics.activeUsers} active users
                      </Typography>
                    </Box>
                    <PeopleIcon sx={{ fontSize: 40, color: "#1e5393" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Active Users
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        {statistics.activeUsers}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {statistics.totalUsers > 0 
                          ? `${Math.round((statistics.activeUsers / statistics.totalUsers) * 100)}% of total`
                          : "No users yet"}
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: "#43a047" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Rooms
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        {statistics.totalRooms}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {statistics.totalBookings} total bookings
                      </Typography>
                    </Box>
                    <MeetingRoomIcon sx={{ fontSize: 40, color: "#1e5393" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* User Activity Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  User Activity
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={statistics.userActivity}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="active"
                        stroke="#1e5393"
                        activeDot={{ r: 8 }}
                        name="Active Users"
                      />
                      <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Gauges */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  System Metrics
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", py: 3 }}>
                  <GaugeChart value={statistics.bounceRate} color="#ff9800" label="Bounce Rate" />
                  <GaugeChart value={statistics.roomUsageRate} color="#4caf50" label="Room Usage" />
                </Box>
              </Paper>
            </Grid>

            {/* Room Usage by Type */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Room Usage by Type
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statistics.roomUsageByType}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#1e88e5" name="Room Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AdminSidebar>
  )
}

export default AdminDashboard
