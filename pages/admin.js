import { useSession } from "next-auth/react";
import * as React from 'react';


export default function AdminDashboard() {
  const { data: session } = useSession();
  // session is always non-null inside this page, all the way down the React tree.
  return "Some super secret dashboard";
}

AdminDashboard.auth = {
  role: "admin",
  loading: <div>loading</div>,
  unauthorized: "/login-with-different-user", // redirect to this url
}
