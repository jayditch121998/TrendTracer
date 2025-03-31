import { useCallback, useEffect, useState } from 'react';
import Echo from 'laravel-echo'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Avatar, Box, Grid, InputAdornment, Paper, Stack, TextField, Typography, Container, LinearProgress, Card, CardHeader, CardMedia, CardContent, CardActions } from "@mui/material";
import axios from 'axios';

import { VideoSort } from '../video-sort';

import { DashboardContent } from "../../../layouts/dashboard";

type UserDataType = {
  username?: string;
  profile_picture_url?: string;
  follows_count?: number;
  followers_count?: number;
  media_count?: number;
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export function UserReelsView() {
  const [sortBy, setSortBy] = useState('viewsDesc');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingReels, setFetchingReels] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState<UserDataType>({});
  const [reels, setReels] = useState([]);

  const sortOptions = [
    { value: 'viewsDesc', label: 'Most Views' },
    { value: 'viewsAsc', label: 'Least Views' },
    { value: 'likesDesc', label: 'Most Likes' },
    { value: 'likesAsc', label: 'Least Likes' },
  ];

  const sortMedia = (data: any[]) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'viewsDesc':
          return b.views_view_count - a.views_view_count;
        case 'viewsAsc':
          return a.views_view_count - b.views_view_count;
        case 'likesDesc':
          return b.likes - a.likes;
        case 'likesAsc':
          return a.likes - b.likes;
        default:
          return b.views_view_count - a.views_view_count;
      }
    });
  };

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchUserMedia();
    }
  };

  const fetchUserMedia = async () => {
    try {
      setLoading(true);
      setUserData({})
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instagram/search/user`, {
        params: { 
          username: searchQuery,
          limit: 2
        },
        headers: {
          Accept: 'application/json',
        },
      });

      setUserData(response.data.business_discovery);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching data from Facebook Graph API:', err);
    } finally {
      setLoading(false);
      setFetchingReels(true);
    }
  };

  const fetchDataSet = async (datasetId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/apify/run/results`, {
        params: { dataset_id: datasetId },
        headers: {
          Accept: 'application/json',
        },
      });

      setReels(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching data from Facebook Graph API:', err);
    } finally {
      setFetchingReels(false);
    }
  };

  useEffect(() => {
    const channel = window.Echo.channel('frontend-channel')
      .listen('.triggered', (e) => {
        fetchDataSet(e.data.dataset_id);
      });
  
    return () => {
      channel.stopListening('.triggered');
    };
  }, []);
  
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Search User Reels
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: 5 }}
      >
        <TextField
          label="Search User"
          disabled={loading || fetchingReels}
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          sx={{ width: { xs: "100%", sm: "300px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
          <VideoSort
            sortBy={sortBy}
            onSort={handleSort}
            options={sortOptions}
          />
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}
        {
          userData && Object.keys(userData).length > 0 && (
            <Container maxWidth="lg">
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar
                        alt={userData.username}
                        src={userData.profile_picture_url}
                        sx={{ width: 100, height: 100 }}
                      />

                      <Stack spacing={1}>
                        <Typography variant="h6" noWrap>
                          {userData.username}
                        </Typography>

                        <Stack direction="row" spacing={3}>
                          <Typography variant="body2">
                            <strong>{formatNumber(userData.media_count)}</strong> posts
                          </Typography>
                          <Typography variant="body2">
                            <strong>{formatNumber(userData.followers_count)}</strong> followers
                          </Typography>
                          <Typography variant="body2">
                            <strong>{formatNumber(userData.follows_count)}</strong> following
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          )
        }
        
        {fetchingReels && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={2}
            >
              <LinearProgress sx={{ width: '100%' }} />
              <Typography variant="body2" mt={1} color="textSecondary">
                Fetching reels...
              </Typography>
            </Box>
          </Grid>
        )}

        {reels.length > 0 && (
          sortMedia(reels).map((mediaItem) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={mediaItem.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia>
                  <video width="100%" height="194" controls>
                    <source src={mediaItem.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </CardMedia>
                <CardContent sx={{height: '90px'}}>
                  <Typography variant="body2" color="text.secondary">
                    {mediaItem.caption &&
                      mediaItem.caption.slice(0, 150) +
                      (mediaItem.caption.length > 20 && "...")
                    }
                  </Typography>
                </CardContent>
                <CardActions>
                  <VisibilityIcon /> {formatNumber(mediaItem.views_view_count)}
                  <FavoriteIcon /> {formatNumber(mediaItem.likes)}
                  <CommentIcon /> {formatNumber(mediaItem.comments_count)}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </DashboardContent>
  );
}