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
import { getRooms, deleteRoom, Room } from "../../../services/roomService"

export const AdminRooms: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      setLoading(true)
      const data = await getRooms()
      setRooms(data)
      setError(undefined)
    } catch (err: any) {
      setError(err.message || 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  const handleEditRoom = (id: string) => {
    navigate(PATHS.ADMIN_ROOMS_EDIT.path.replace(":id", id))
  }

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return

    try {
      await deleteRoom(roomToDelete.id)
      setRooms(current => current.filter(r => r.id !== roomToDelete.id))
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
      setError(undefined)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Could not delete room. Please try again.')
      setDeleteDialogOpen(false)
    }
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
              <Typography variant="h4">Rooms</Typography>
              <Button
                component={Link}
                to={PATHS.ADMIN_ROOMS_CREATE.path}
                variant="contained"
                startIcon={<AddIcon />}
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
