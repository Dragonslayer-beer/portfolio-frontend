
//app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from "next-auth/jwt";


interface CustomJWT extends JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
}

async function refreshAccessToken(token: CustomJWT): Promise<CustomJWT> {
    try {

        const url = `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`;

        // console.log("tokenRefreshAccessToken", token)
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                refresh_token: token.refreshToken,
            }),
            headers: { 'Content-Type': 'application/json' },
        });



        const data = await response.json();
        // console.log("dataRefreshAccessToken", data)

        if (!response.ok) {
            // Check if the error is due to an expired refresh token
            // if (data.error && data.error.message === 'TOKEN_EXPIRED') {
            //   return {
            //     ...token,
            //     error: "RefreshTokenExpired",
            //   };
            // }
            return {
                ...token,
                error: "RefreshTokenExpired",
            };
        }

        return {
            // ...token,
            error: '',   //test
            accessToken: data.accessToken,
            refreshToken: data.refreshToken, // Keep the old refresh token if none is returned
            accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiration

        };
    } catch (error: any) {
        console.error('Error refreshing access token:', error);

        return {
            ...token,
            error: "RefreshTokenExpired",
        };
    }
}


/**
 * Refreshes the Firebase access token using the refresh token
 * @param token Current JWT token containing refresh token
 * @returns Updated token object or null if refresh failed
 */
async function loginFunction(email: string, password: string): Promise<CustomJWT> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (response.status !== 200) {
            // console.log("data", data.message)
            throw data.message || 'Authentication failed';
        }
        return data as CustomJWT; // Ensure `data` matches `CustomJWT` type.
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

// export const authOptions: NextAuthOptions = 

const handler = NextAuth(
    {
        providers: [
            CredentialsProvider({
                name: 'Credentials',
                credentials: {
                    email: { label: 'Email', type: 'email' },
                    password: { label: 'Password', type: 'password' },
                },
                async authorize(credentials): Promise<any> {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Missing credentials');
                    }

                    try {
                        const userCredential: any = await loginFunction(
                            credentials?.email, credentials?.password
                        )
                        console.log("userCredential", userCredential)
                        return {
                            accessToken: userCredential.accessToken,
                            refreshToken: userCredential.refreshToken,
                            error: '',
                        };
                    } catch (error: any) {
                        console.error('Authentication error:', error);
                        // Return custom error message
                        throw new Error(error.message || 'Authentication failed');
                    }
                },
            })
        ],
        session: {
            strategy: 'jwt',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        },
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            jwt: async ({ token, user }: any) => {
                if (user) {
                    return {
                        ...token,
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiration
                        error: '',
                    };
                }
                console.log("STATUS TOKEN", Date.now() < token.accessTokenExpires - 1 * 60 * 1000)
                // Return previous token if the access token has not expired
                console.log("accessTokenExpires", token.accessTokenExpires - 1 * 60 * 1000)
                console.log("Date.now()", Date.now())

                console.log(token.accessTokenExpires - Date.now())
                if (Date.now() < token.accessTokenExpires - 1 * 60 * 1000) {

                    //  console.log("token" , token)
                    return {
                        ...token,
                        error: '',
                    };
                }


                const refreshedToken = await refreshAccessToken(token);

                console.log("refreshedToken", refreshedToken)

                // console.log("refreshedToken", refreshedToken)
                if (refreshedToken.error) {
                    return {
                        ...token,
                        error: refreshedToken.error,
                    };
                } else {

                    return {
                        ...refreshedToken,
                        // error: 'Failed to refresh access token. Please log in again.',
                    };

                }

            },

            session: async ({ session, token }): Promise<any> => {
                // console.log("session" , session)

                if (token.error) {
                    // If there's an error in the token, pass it to the session
                    // @ts-ignore 
                    session.error = token.error;
                }
                // @ts-ignore 
                session.accessToken = token.accessToken;
                // @ts-ignore 
                session.refreshToken = token.refreshToken;



                return session;
            },
        },
    }

);
export { handler as GET, handler as POST };