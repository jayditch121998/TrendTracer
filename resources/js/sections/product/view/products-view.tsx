import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { _products } from '../../../_mock';
import { DashboardContent } from '../../../layouts/dashboard';
import { UserMediaItem } from '../user-medias';
import { UserItem } from '../user-items';
import { ProductSort } from '../product-sort';
import { CartIcon } from '../product-cart-widget';
import type { FiltersProps } from '../product-filters';

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

type UserDataType = {
  username?: string;
  profile_picture_url?: string;
  follows_count?: number;
  followers_count?: number;
};

type UserMediaType = {
  username?: string;
  profile_picture_url?: string;
  follows_count?: number;
  followers_count?: number;
  media:{
    data: Array<{
      id: string;
      media_url: string;
      caption?: string;
      like_count: number;
      comments_count: number;
      timestamp: Date;
      media_type: string;
    }>
  }
};

export function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');
  const [openFilter, setOpenFilter] = useState(false);
  const [userData, setUserData] = useState<UserDataType>({});
  const [userMedia, setUserMedia] = useState<UserMediaType>();
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const [searchQuery, setSearchQuery] = useState('');

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchUserMedia();
    }
  };

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  const fetchUserMedia = async () => {
    try {
      setLoading(true);
      setUserMedia({
        username: "",
        profile_picture_url: "",
        follows_count: 0,
        followers_count: 0,
        media: {
          data: []
        }
      });
      setUserData({})
  
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instagram/search/user`, {
        params: { username: 'eminem' },
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
    }
  };

  const handleViewProfile = async () => {
    console.log('CALLED!');
    try {
      setLoading(true);
      setUserData({});

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instagram/search/user/medias`, {
        params: { username: 'eminem' },
        headers: {
          Accept: 'application/json',
        },
      });

      setUserMedia(response.data.business_discovery);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching data from Facebook Graph API:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        User Search
      </Typography>

      <CartIcon totalItems={8} />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: 5 }}
      >
        <TextField
          label="Search User"
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
          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      {loading && <Typography>Loading data...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      <Grid container spacing={3}>
        {userData && Object.keys(userData).length > 0 && (
          <Grid item xs={12} sm={6} md={3}>
            <UserItem
              userData={{
                username: userData.username || '',
                profile_picture_url: userData.profile_picture_url || '',
                follows_count: userData.follows_count || 0,
                followers_count: userData.followers_count || 0,
                handleViewProfile: handleViewProfile
              }}
            />
          </Grid>
        )}

        {userMedia && Object.keys(userMedia).length > 0 && (
          <Grid item xs={12}>
            <UserMediaItem
              userData={{
                business_discovery: {
                  username: userMedia.username || '',
                  profile_picture_url: userMedia.profile_picture_url || '',
                  follows_count: userMedia.follows_count || 0,
                  followers_count: userMedia.followers_count || 0,
                  media: userMedia.media
                }
              }}
            />
          </Grid>
        )}
        
      </Grid>

      {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
