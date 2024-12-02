"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  const handleSignin = async () => {
    if (session) {
      // User is signed in, sign them out
      signOut();
    } else {
      // User is not signed in, sign them in      

      // Sign in with Google after authorization
      signIn("google");
    }
  };

  return (
    <div>
      <button
        className={`border rounded px-4 py-2 ${
          session ? "bg-red-500 text-white" : "bg-blue-500 text-white"
        }`}
        onClick={handleSignin}
      >
        {session ? "Log Out" : "Google Log In"}
      </button>
    </div>
  );
}

export const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      {children}
    </button>
  );
};



// export function LoginButton() {
//   const { data: session } = useSession();

//   const handleLogin = () => {
//     session ? signOut() : signIn();
//   };

//   return (
//     <button
//       className={`border border-transparent rounded px-4 py-2 transition-colors ${
//         session
//           ? "bg-red-500 hover:bg-red-700 text-white"
//           : "bg-blue-500 hover:bg-blue-700 text-white"
//       }`}
//       onClick={handleLogin}
//     >
//       Google {session ? "Log Out" : "Log In"}
//     </button>
//   );
// }
