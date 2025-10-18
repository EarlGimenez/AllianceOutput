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
import { getAllUsers, deleteUser, User } from "../../../services/authService"

export const AdminUsers: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(data)
      setError(undefined)
    } catch (err: any) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (id: string) => {
    navigate(PATHS.ADMIN_USERS_EDIT.path.replace(":id", id))
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete.userId)
      setUsers(current => current.filter(u => u.userId !== userToDelete.userId))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      setError(undefined)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Could not delete user.')
      setDeleteDialogOpen(false)
    }
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
                    <TableRow key={user.userId}>
                      <TableCell>{user.userId}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                       <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton onClick={() => handleEditUser(user.userId)} sx={{ color: "#1e5393" }}>
                            <EditIcon />
                          </IconButton>
                          <Typography variant="body2" onClick={() => handleEditUser(user.userId)} sx={{ cursor: "pointer", color: "#1e5393" }}>
                            Edit
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton onClick={() => handleDeleteClick(user)} sx={{ color: "#f44336" }}>
                            <DeleteIcon />
                          </IconButton>
                          <Typography variant="body2" onClick={() => handleDeleteClick(user)} sx={{ cursor: "pointer", color: "#f44336" }}>
                            Delete
                          </Typography>
                        </Box>
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
            Are you sure you want to delete “{userToDelete?.username}”? This cannot be undone.
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
