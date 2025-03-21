import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Avatar from '@mui/material/Avatar';
import { CardActions, CardContent, CardHeader, CardMedia, Grid } from '@mui/material';

export type UserMediaItemProps = {
  business_discovery: {
    username: string;
    profile_picture_url: string;
    follows_count: number;
    followers_count: number;
    media?: {
      data: Array<{
        id: string;
        media_url: string;
        caption?: string;
        like_count: number;
        comments_count: number;
        timestamp: Date;
        media_type: string;
      }>;
    };
  };
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // Millions
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"; // Thousands
  }
  return num.toLocaleString(); // Adds commas (e.g., 1,234)
};

export function UserMediaItem({ userData }: { userData: UserMediaItemProps }) {
  return (
    <Grid container spacing={2}>
      {userData.business_discovery.media?.data?.length ? (
        [...userData.business_discovery.media.data] // ✅ Clone array to avoid mutating original data
          .sort((a, b) => b.like_count - a.like_count) // ✅ Sort by likes (DESC)
          .map((mediaItem) => (
            mediaItem.media_type === 'VIDEO' && (
              <Grid item xs={12} sm={6} md={4} lg={3} key={mediaItem.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        alt={userData.business_discovery.username}
                        src={userData.business_discovery.profile_picture_url}
                      />
                    }
                    title={userData.business_discovery.username}
                  />
                  <CardMedia>
                    <video width="100%" height="194" controls>
                      <source src={mediaItem.media_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </CardMedia>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {mediaItem.caption &&
                        mediaItem.caption.slice(0, 150) +
                        (mediaItem.caption.length > 20 && "...")
                      }
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <FavoriteIcon /> {formatNumber(mediaItem.like_count)}
                    <CommentIcon /> {formatNumber(mediaItem.comments_count)}
                  </CardActions>
                </Card>
              </Grid>
            )
          ))
      ) : (
        <Typography variant="body2">No media available</Typography>
      )}
    </Grid>
  );
}