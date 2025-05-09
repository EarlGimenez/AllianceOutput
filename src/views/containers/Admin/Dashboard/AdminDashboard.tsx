"use client"

import type React from "react"
import { Box, Typography, Grid, Card, CardContent, Paper, useTheme, CircularProgress } from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import PeopleIcon from "@mui/icons-material/People"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PublicIcon from "@mui/icons-material/Public"
import { AdminSidebar } from "../../../components/AdminSidebar"
import { AdminHeader } from "../../../components/AdminHeader"

const AdminDashboard: React.FC = () => {
  const theme = useTheme()

  // Mock data for metrics
  const metrics = {
    totalUsers: 1248,
    activeUsers: 876,
    totalRooms: 32,
    bounceRate: 24,
    roomUsageRate: 78,
  }

  // Mock data for user distribution by country
  const usersByCountry = [
    { name: "United States", value: 540 },
    { name: "United Kingdom", value: 210 },
    { name: "Canada", value: 170 },
    { name: "Australia", value: 140 },
    { name: "Germany", value: 90 },
    { name: "Others", value: 98 },
  ]

  // Mock data for user activity over time
  const userActivity = [
    { name: "Jan", active: 400, total: 600 },
    { name: "Feb", active: 450, total: 650 },
    { name: "Mar", active: 480, total: 700 },
    { name: "Apr", active: 520, total: 750 },
    { name: "May", active: 600, total: 800 },
    { name: "Jun", active: 650, total: 850 },
    { name: "Jul", active: 700, total: 900 },
    { name: "Aug", active: 750, total: 950 },
    { name: "Sep", active: 800, total: 1000 },
    { name: "Oct", active: 850, total: 1100 },
    { name: "Nov", active: 870, total: 1200 },
    { name: "Dec", active: 876, total: 1248 },
  ]

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Custom gauge chart component
  const GaugeChart = ({ value, color, label }: { value: number; color: string; label: string }) => {
    return (
      <Box sx={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            sx={{
              color: theme.palette.grey[200],
            }}
            size={120}
            thickness={6}
            value={100}
          />
          <CircularProgress
            variant="determinate"
            sx={{
              color: color,
              position: "absolute",
              left: 0,
            }}
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

  return (
    <AdminSidebar>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          {/* Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        {metrics.totalUsers}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        +12% from last month
                      </Typography>
                    </Box>
                    <PeopleIcon sx={{ fontSize: 40, color: "#1e5393" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Active Users
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        {metrics.activeUsers}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        70% of total users
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: "#1e5393" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Rooms
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        {metrics.totalRooms}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        +3 new rooms added
                      </Typography>
                    </Box>
                    <MeetingRoomIcon sx={{ fontSize: 40, color: "#1e5393" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        User Countries
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "medium", mb: 1 }}>
                        24
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Global presence
                      </Typography>
                    </Box>
                    <PublicIcon sx={{ fontSize: 40, color: "#1e5393" }} />
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
                      data={userActivity}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
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

            {/* Users by Country */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Users by Country
                </Typography>
                <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByCountry}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usersByCountry.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Gauge Charts */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  System Metrics
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", py: 3 }}>
                  <GaugeChart value={metrics.bounceRate} color="#ff9800" label="Bounce Rate" />
                  <GaugeChart value={metrics.roomUsageRate} color="#4caf50" label="Room Usage Rate" />
                </Box>
              </Paper>
            </Grid>

            {/* Room Usage by Type */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Room Usage by Type
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Conference", usage: 85 },
                        { name: "Meeting", usage: 75 },
                        { name: "Board", usage: 60 },
                        { name: "Huddle", usage: 90 },
                        { name: "Training", usage: 50 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Usage %", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" fill="#1e5393" name="Usage %" />
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
