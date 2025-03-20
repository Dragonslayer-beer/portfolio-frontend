"use client";

import { LOGIN_ROUTE } from "@/constants/routes";
import useAuthentication from "@/hook/useAuthentication";
import { Box, Button } from "@mui/material";
import { signOut } from "next-auth/react";

const DashboardPages = () => {
    
      useAuthentication();

    return <Box>
        <h1>Dashboard</h1>

        <Button variant="contained" color="primary"
            onClick={() => {
                signOut({ callbackUrl: LOGIN_ROUTE }); // Redirect to login
            }}>
            Sight Out
        </Button>

    </Box>
}
export default DashboardPages;
