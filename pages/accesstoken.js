import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
export default function Component() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
    },
  });
  console.log(session);
  if (status === "authenticated") {
    return <div>Signed in as {session.user.email}</div>;
  }
  if (status === "loading") {
    return "Loading or not authenticated...";
  }
  return <div>Access Token: </div>;
}
