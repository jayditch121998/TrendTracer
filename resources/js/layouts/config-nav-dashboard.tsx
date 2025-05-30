import { SvgColor } from '../components/svg-color';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Search User Reels',
    path: 'user-reels',
    icon: icon('ic-search')
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  // {
  //   title: 'Search User',
  //   path: '/user-search',
  //   icon: icon('ic-user'),
  // },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
