// export * from "./Main";
export { default as Homepage } from "./Homepage";
export { default as About } from "./About"
export { default as Contact } from "./Contact"
export { default as Register } from "./Register"
export { default as Recovery } from "./Recovery"
export { default as Login } from "./Login";
export * from "./Logout";
export * from "./UserDayView";
export * from "./UserReservation";
export { default as NotFound } from "./NotFound";
export * from "./UserDashboard";
export { default as Settings } from "./Settings";

// Admin containers
export { AdminLogin } from "./Admin/Login"
export { AdminDashboard } from "./Admin/Dashboard"
export { AdminCalendar } from "./Admin/Calendar"
export { AdminRooms } from "./Admin/Rooms"
export { AdminRoomsCreate } from "./Admin/Rooms/Create"
export { AdminRoomsEdit } from "./Admin/Rooms/Edit"
export { AdminUsers } from "./Admin/Users"
export { AdminUsersCreate } from "./Admin/Users/Create"
export { AdminUsersEdit } from "./Admin/Users/Edit"