// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Not Found"
  },
  HOMEPAGE: {
    path: "/home",
    label: "Homepage"
  },
  CALENDAR: {
    path: "/calendar",
    label: "Calendar" 
  },
  ABOUT: {
    path: "/about",
    label: "About"
  },
  CONTACT: {
    path: "/contact",
    label: "Contact"
  },
  REGISTER: {
    path: "/register",
    label: "Register"
  },
  RECOVERY: {
    path: "/recovery",
    label: "Recovery"
  },
  LOGIN: {
    path: "/login",
    label: "Login"
  },
  LOGOUT: {
    path: "/logout",
    label: "Logout"
  },
  USER_DASHBOARD: {
    path: "/user-dashboard",
    label: "User Dashboard"
  },
  USER_DAYVIEW: {
    path: "/user-dayview",
    label: "User Dayview"
  },
  USER_RESERVATION: {
    path: "/user-reservation",
    label: "User Reservation"
  },
  ADMIN_LOGIN: {
    path: "/admin/login",
    name: "Admin Login",
  },
  ADMIN_DASHBOARD: {
    path: "/admin/dashboard",
    name: "Admin Dashboard",
  },
  ADMIN_CALENDAR: {
    path: "/admin/calendar",
    name: "Admin Calendar",
  },
  ADMIN_ROOMS: {
    path: "/admin/rooms",
    name: "Admin Rooms",
  },
  ADMIN_ROOMS_CREATE: {
    path: "/admin/rooms/create",
    name: "Create Room",
  },
  ADMIN_ROOMS_EDIT: {
    path: "/admin/rooms/edit/:id",
    name: "Edit Room",
  },
  ADMIN_USERS: {
    path: "/admin/users",
    name: "Admin Users",
  },
  ADMIN_USERS_CREATE: {
    path: "/admin/users/create",
    name: "Create User",
  },
  ADMIN_USERS_EDIT: {
    path: "/admin/users/edit/:id",
    name: "Edit User",
  },
  NOT_FOUND: {
    path: "*",
    label: "Not Found"
  }
  // Add more routes here
};

// SIDE BAR MENU PATH
export const SIDE_BAR_MENU = [
  {
    path: "/dashboard",
    label: "Dashboard"
  },
  {
    path: "/logout",
    label: "Logout"
  }
  // Add more path here
];
