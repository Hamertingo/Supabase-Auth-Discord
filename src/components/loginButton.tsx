/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import supabase from "@/lib/supabase/supabase";

export default function LoginButton() {
  const signInWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`
      }
    })

    if (error) {
      console.error(error);
    }
  }

  return (
    <button onClick={signInWithDiscord}>Sign in with Discord</button>
  );
}