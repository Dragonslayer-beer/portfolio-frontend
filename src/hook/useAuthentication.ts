//hooks/useAuthentication
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { DASHBOARD_PATH, GUEST_ROUTES, LOGIN_ROUTE } from "@/constants/routes";


const useAuthentication = () => {
  const router = useRouter();
  const currentRoute = usePathname(); // Call this directly, not inside useMemo
  const { data: session, status }: any = useSession(); // Replace `any` with specific type

  useEffect(() => {
    if (status === "loading") return; // Handle loading state gracefully 
    // console.log("session? " , status )
    if (session?.error === "RefreshTokenExpired") {
      // console.log("console", session)
      console.error("Session error: RefreshTokenExpired");
      signOut({ callbackUrl: LOGIN_ROUTE }); // Redirect to login
      return;
    }
    if (status === "unauthenticated" && !GUEST_ROUTES.includes(currentRoute)) {
      // console.warn("Unauthenticated user on protected route. Redirecting to login.");
      router.replace(LOGIN_ROUTE);
      return;
    }

    // Redirect authenticated users away from guest routes
    if (status === "authenticated" && GUEST_ROUTES.includes(currentRoute)) {
      // console.info("Authenticated user on guest route. Redirecting to dashboard.");
      router.replace(DASHBOARD_PATH);
    }

  }, [status, currentRoute, session?.error, router]);


  return null;

};

export default useAuthentication;
