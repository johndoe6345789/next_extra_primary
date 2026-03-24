import { setRequestLocale } from "next-intl/server";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

/** Props for the contact page. */
interface ContactPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Contact page with an enquiry form.
 *
 * Renders a simple contact form with name, email,
 * and message fields inside a centred container.
 *
 * @param props - Page props with locale params.
 * @returns Contact page UI.
 */
export default async function ContactPage({
  params,
}: ContactPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container
      component="main"
      role="main"
      maxWidth="sm"
      sx={{ py: 6 }}
      aria-label="Contact us"
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        Contact Us
      </Typography>
      <Box
        component="form"
        aria-label="Contact form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          label="Name"
          name="name"
          required
          fullWidth
          autoComplete="name"
          inputProps={{ "aria-required": true }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          fullWidth
          autoComplete="email"
          inputProps={{ "aria-required": true }}
        />
        <TextField
          label="Message"
          name="message"
          required
          fullWidth
          multiline
          rows={5}
          inputProps={{ "aria-required": true }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          aria-label="Send contact message"
        >
          Send Message
        </Button>
      </Box>
    </Container>
  );
}
