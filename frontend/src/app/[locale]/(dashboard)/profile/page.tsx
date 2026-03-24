import { setRequestLocale } from "next-intl/server";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

/** Props for the profile page. */
interface ProfilePageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * User profile page.
 *
 * Displays user information, a badge showcase,
 * and cumulative statistics in card sections.
 *
 * @param props - Page props with locale params.
 * @returns Profile page UI.
 */
export default async function ProfilePage({
  params,
}: ProfilePageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box aria-label="User profile">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        Profile
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" component="h2">
            User Information
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Name, email, and account details
            will appear here.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" component="h2">
            Badges
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Your earned badges will be
            showcased here.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" component="h2">
            Statistics
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Cumulative stats and progress
            will appear here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
