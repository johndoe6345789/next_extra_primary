import { setRequestLocale } from "next-intl/server";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { RegisterForm } from
  "@/components/organisms/RegisterForm";

/** Props for the register page. */
interface RegisterPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Registration page with a centred card layout.
 *
 * Renders the `RegisterForm` organism inside a
 * centred card for new-user sign-up.
 *
 * @param props - Page props with locale params.
 * @returns Registration page UI.
 */
export default async function RegisterPage({
  params,
}: RegisterPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      component="main"
      role="main"
      aria-label="Create account"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        px: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 480, width: "100%" }}
        elevation={3}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            Create Account
          </Typography>
          <RegisterForm />
        </CardContent>
      </Card>
    </Box>
  );
}
