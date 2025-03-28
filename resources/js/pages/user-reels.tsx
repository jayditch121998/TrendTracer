import { Helmet } from "react-helmet-async";

import { UserReelsView } from '../sections/user-reels/view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Search User Reels</title>
      </Helmet>
      <UserReelsView />
    </>
  )
}