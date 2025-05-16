"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { Link, useNavigate } from "react-router-dom"
import { AdminSidebar } from "../../../components/AdminSidebar"
import { PATHS } from "../../../../constant"

interface User {
  id: string
  email: string
  username: string
  fullName: string
  company: string
}

export const AdminUsers: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // load users
  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then(async res => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`)
        return res.json()
      })
      .then((data: User[]) => {
        // Ensure all `id`s are strings
        const usersWithStringIds = data.map(user => ({ ...user, id: String(user.id) }))
        setUsers(usersWithStringIds)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

const handleEditUser = (id: string) => {
  console.log(`id: ${id}, path: ${PATHS.ADMIN_USERS_EDIT.path.replace(":id", id)}`);
  navigate(PATHS.ADMIN_USERS_EDIT.path.replace(":id", id));
}


  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!userToDelete) return

    fetch(`http://localhost:3001/users/${userToDelete.id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error(`Delete failed (${res.status})`)
        setUsers(u => u.filter(x => x.id !== userToDelete.id))
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      })
      .catch(err => {
        console.error(err)
        setError("Could not delete user.")
        setDeleteDialogOpen(false)
      })
  }

  if (loading) return <AdminSidebar><CircularProgress /></AdminSidebar>
  if (error)   return <AdminSidebar><Alert severity="error">{error}</Alert></AdminSidebar>

  return (
    <AdminSidebar>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Users</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to={PATHS.ADMIN_USERS_CREATE.path}
              sx={{ bgcolor: "#1e5393", "&:hover": { bgcolor: "#184377" } }}
            >
              Create User
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditUser(user.id)} sx={{ color: "#1e5393" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(user)} sx={{ color: "#f44336" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete “{userToDelete?.fullName}”? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminSidebar>
  )
}

export default AdminUsers
