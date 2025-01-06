'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button 
      onClick={handleSignOut}
      className="px-6 py-2 bg-[#0b663f] text-white rounded-lg hover:bg-[#3ec489] transition-colors duration-200 font-medium"
    >
      Sign Out
    </button>
  );
}
