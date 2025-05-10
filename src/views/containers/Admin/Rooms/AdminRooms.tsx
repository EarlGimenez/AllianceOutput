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

interface Room {
  id: number
  name: string
  location: string
  timeStart: string
  timeEnd: string
}

export const AdminRooms: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

  // 1) Load rooms from json‑server
  useEffect(() => {
    fetch("http://localhost:3001/rooms")
      .then(async res => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`)
        return res.json()
      })
      .then((data: Room[]) => setRooms(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleEditRoom = (id: number) => {
    navigate(PATHS.ADMIN_ROOMS_EDIT.path.replace(":id", String(id)))
  }

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!roomToDelete) return

    // 2) DELETE on the server
    fetch(`http://localhost:3001/rooms/${roomToDelete.id}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error(`Delete failed (${res.status})`)
        // 3) Remove from local state
        setRooms(current => current.filter(r => r.id !== roomToDelete.id))
        setDeleteDialogOpen(false)
        setRoomToDelete(null)
      })
      .catch(err => {
        console.error(err)
        setError("Could not delete room. Please try again.")
        setDeleteDialogOpen(false)
      })
  }

  if (loading) return <AdminSidebar><CircularProgress /></AdminSidebar>
  if (error) return <AdminSidebar><Alert severity="error">{error}</Alert></AdminSidebar>

  return (
    <AdminSidebar>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Meeting Rooms</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to={PATHS.ADMIN_ROOMS_CREATE.path}
              sx={{ bgcolor: "#1e5393", "&:hover": { bgcolor: "#184377" } }}
            >
              Create Room
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Time Start</TableCell>
                  <TableCell>Time End</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.location}</TableCell>
                    <TableCell>{room.timeStart}</TableCell>
                    <TableCell>{room.timeEnd}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditRoom(room.id)} sx={{ color: "#1e5393" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(room)} sx={{ color: "#f44336" }}>
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
            Are you sure you want to delete &ldquo;{roomToDelete?.name}&rdquo;? This cannot be undone.
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

export default AdminRooms
