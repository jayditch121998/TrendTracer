import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { fCurrency } from '../../utils/format-number';
import { Label } from '../../components/label';
import { ColorPreview } from '../../components/color-utils';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';

export type ProductItemProps = {
  username: string;
  profile_picture_url: string;
  follows_count: number;
  followers_count: number;
  handleViewProfile: () => void;
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // Millions
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"; // Thousands
  }
  return num.toLocaleString(); // Adds commas (e.g., 1,234)
};

export function UserItem({ userData }: { userData: ProductItemProps }) {
  const handleViewProfile = () => {
    userData.handleViewProfile();
  };

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6" noWrap>
          {userData.username}
        </Typography>
      </Stack>

      <Box sx={{ pt: '40%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          alt={userData.username}
          src={userData.profile_picture_url}
          sx={{ width: 100, height: 100, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <Box display="flex" alignItems="center">
              <FavoriteIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{formatNumber(userData.follows_count) || 0} Following</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{formatNumber(userData.followers_count) || 0} Followers</Typography>
            </Box>
          </Stack>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" size="large" sx={{ mt: 2 }} onClick={() => handleViewProfile()}>
            View Profile
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}