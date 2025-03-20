
//content/Login/index.tsx
'use client';
import { Box, Button, Card, CircularProgress, Container, IconButton, InputAdornment, TextField, Typography, styled, useTheme } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { usePathname, useRouter } from 'next/navigation'
import Grid from '@mui/material/Grid2';
import { MdOutlineEmail } from "react-icons/md";
import { CiLock, CiUnlock } from "react-icons/ci";
import { signIn, useSession } from "next-auth/react";
import { DASHBOARD_PATH, GUEST_ROUTES } from "@/constants/routes";
const TypographyH1 = styled(Typography)(
    ({ theme }) => `
       font-size: ${theme.typography.pxToRem(28)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }
`
);

const LoginPage = () => {

    // const { register, handleSubmit, formState: { errors } } = useForm()
    const [showPassword, setShowPassword] = useState(false);
    const [showLoding, setLoding] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const formikRef = useRef<FormikProps<any> | null>(null);

    const theme = useTheme();


    // const { data: session, status } = useSession();

    const currentRoute = usePathname();



    const router = useRouter();


    const onSubmits = async (data: any) => {
        try {

            setLoding(true);
            // const user = `${dataEncryption(data.username as string)}`
            // const password = `${dataEncryption(data.email as string)}`
            const email = data.email;
            const password = data.password;

            const result = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            });

            if (result && result.error) {

                console.log("result.error", result.error)

                setLoding(false)
            } else {

                router.replace(DASHBOARD_PATH);
                console.log("result", result)
                setLoding(false);
            }


        } catch (error: any) {
            console.error(error);
            setLoding(false);

        }
    }


    const { data: session, status }: any = useSession();


    useEffect(() => {
        if (status === "loading") {
            // Optionally handle the loading state
            return;
        }
        if (status !== "loading" && session && session.error === "RefreshTokenExpired") {
            // console.error("Session error detected:", session.error);
            // signOut();
            // router.replace(LOGIN_ROUTE);
            return;
        }
        // console.log(window.location.pathname)

        if (status !== "loading" && status === "authenticated" && GUEST_ROUTES.includes(currentRoute)) {
            router.replace(DASHBOARD_PATH);
            return;
        }
    }, [session, status, currentRoute, router]);


    return (
        <>
            <Box

            >

                <Container component="main" sx={{ mt: theme.spacing(12) }}>
                    <Card
                        sx={{
                            py: 10,
                            px: { xs: 2, md: 10 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>

                        <TypographyH1 sx={{ mt: 2, color: theme.colors.primary.main }} variant="h1" gutterBottom >
                            ເຂົ້າສູ່ລະບົບ
                        </TypographyH1>


                        <Formik
                            innerRef={formikRef}
                            initialValues={{

                                email: '',
                                password: '',
                                savepaswword: false,
                                submit: null,
                            }}
                            validationSchema={Yup.object().shape({

                                email: Yup.string()
                                    .email('please enter a valid email') // Ensure it's a valid email format
                                    .required('please enter your email'), // Mark it as required
                                password: Yup.string()
                                    .min(8, 'Password must be at least 8 characters long') // Ensure password is at least 8 characters long
                                    .required('please enter your password'), // Mark it as required


                            })}
                            onSubmit={async (
                                _values,
                                { setErrors, setStatus, setSubmitting }
                            ) => {
                                try {
                                    console.log("_values", _values)

                                    setStatus({ success: true });
                                    setSubmitting(false);
                                    onSubmits(_values);
                                } catch (err: any) {
                                    console.error(err);
                                    setStatus({ success: false });
                                    setErrors({ submit: err.data });
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({
                                errors,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                touched,
                                values,
                                setFieldValue,
                            }) => (
                                <form onSubmit={handleSubmit}>

                                    <Grid container spacing={2}>

                                        <Grid mt={5} size={{ xs: 12, md: 12 }}>

                                            <TextField

                                                fullWidth
                                                autoFocus

                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <MdOutlineEmail />
                                                            </InputAdornment>
                                                        ),
                                                    }
                                                }}
                                                placeholder={'email'}
                                                type="text"
                                                name="email"
                                                value={values.email}
                                                variant="outlined"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={Boolean(touched.email && errors.email)}
                                                helperText={(touched.email && errors.email) ? String(errors.email) : ''}
                                            />

                                        </Grid>
                                        <Grid size={{ xs: 12, md: 12 }} >

                                            <TextField

                                                fullWidth
                                                autoFocus
                                                value={values.password}
                                                placeholder={'password'}
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                variant="outlined"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={Boolean(touched.password && errors.password)}
                                                helperText={(touched.password && errors.password) ? String(errors.password) : ''}

                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CiLock />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                >
                                                                    {showPassword ? <CiLock /> : <CiUnlock />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    },
                                                }}
                                            />

                                        </Grid>

                                        <Grid size={{ xs: 12, md: 12 }} >
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                startIcon={showLoding ? <CircularProgress size="1rem" /> : null}
                                                disabled={showLoding}
                                                style={{ background: showLoding ? '#ffff' : `${theme.colors.gradients.primary}` }}

                                            >
                                                Sign In
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </form>
                            )}
                        </Formik>

                    </Card>

                </Container >
            </Box>



        </>
    )
}

export default LoginPage

