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
  id: number;
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  purpose: string; 
  image: string; 
}

export const AdminRooms: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

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

    fetch(`http://localhost:3001/rooms/${roomToDelete.id}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error(`Delete failed (${res.status})`)
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

  return (
    <AdminSidebar>
      <Box sx={{ p: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
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
                    <TableCell>Purpose</TableCell>
                    <TableCell>Time Start</TableCell>
                    <TableCell>Time End</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map(room => (
                    <TableRow key={room.id}>
                      <TableCell>{room.id}</TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>{room.purpose}</TableCell>
                      <TableCell>{room.timeStart}</TableCell>
                      <TableCell>{room.timeEnd}</TableCell>
                      <TableCell>
                        {room.image ? (
                          <img
                            src={room.image}
                            alt={room.name}
                            style={{ width: 50, height: 50, objectFit: "cover" }}
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton onClick={() => handleEditRoom(room.id)} sx={{ color: "#1e5393" }}>
                            <EditIcon />
                          </IconButton>
                          <Typography
                            variant="body2"
                            onClick={() => handleEditRoom(room.id)}
                            sx={{ cursor: "pointer", color: "#1e5393" }}
                          >
                            Edit
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton onClick={() => handleDeleteClick(room)} sx={{ color: "#f44336" }}>
                            <DeleteIcon />
                          </IconButton>
                          <Typography
                            variant="body2"
                            onClick={() => handleDeleteClick(room)}
                            sx={{ cursor: "pointer", color: "#f44336" }}
                          >
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
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
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
