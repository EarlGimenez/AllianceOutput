import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* ADD PPRIVATE ROUTES HERE (Routes that can only access after login like Dashboard, Account Setting, etc.) */}
          <Route path={PATHS.USER_DASHBOARD.path} element={<Views.UserDashboard />} />
          <Route path={PATHS.USER_DAYVIEW.path} element={<Views.UserDayView />} />
          <Route path={PATHS.USER_RESERVATION.path} element={<Views.UserReservation />} />
          <Route path={PATHS.ADMIN_CALENDAR.path} element={<Views.AdminCalendar />} />
          <Route path={PATHS.ADMIN_REQUESTS.path} element={<Views.AdminRequests />} />
          <Route path={PATHS.ADMIN_ANALYTICS.path} element={<Views.AdminAnalytics />} />
        </Route>
        {/* ADD PUBLIC ROUTES HERE (e.g., Login, Sign Up, Forgot Pass, etc. ) */}
        <Route path={PATHS.HOMEPAGE.path} element={<Views.Homepage />} />
        <Route path={PATHS.ABOUT.path} element={<Views.About />} />
        <Route path={PATHS.CONTACT.path} element={<Views.Contact />} />
        <Route path={PATHS.REGISTER.path} element={<Views.Register />} />
        <Route path={PATHS.RECOVERY.path} element={<Views.Recovery />} />
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
