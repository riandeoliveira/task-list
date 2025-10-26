import { createBrowserRouter } from "react-router";
import { AccountPage } from "@/pages/account";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { ResetPasswordPage } from "@/pages/reset-password";
import { SignInPage } from "@/pages/sign-in";
import { SignUpPage } from "@/pages/sign-up";
import { ProtectedRoute } from "./protected-route";

export const router = createBrowserRouter([
  { path: "*", element: <NotFoundPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
]);
