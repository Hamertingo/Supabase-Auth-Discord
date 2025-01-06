/* eslint-disable @next/next/no-img-element */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function Dashboard() {
  const supabase = await createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/')
    }

    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-black/40 rounded-xl p-6 mb-8 border border-[#3ec489]/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  width={80} 
                  height={80} 
                  className="rounded-full ring-2 ring-[#3ec489]"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#3ec489] w-4 h-4 rounded-full border-2 border-[#121212]"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, <span className="text-[#3ec489]">{user.user_metadata.full_name}!</span>
                </h1>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#3ec489]"></span>
                  Discord User
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/40 rounded-xl p-6 border border-[#3ec489]/20 hover:border-[#3ec489]/40 transition-colors">
              <h3 className="text-[#3ec489] text-sm font-medium">User ID</h3>
              <p className="text-xl font-semibold mt-2 text-white/90">{user.id}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-6 border border-[#3ec489]/20 hover:border-[#3ec489]/40 transition-colors">
              <h3 className="text-[#3ec489] text-sm font-medium">Email</h3>
              <p className="text-xl font-semibold mt-2 text-white/90">{user.email || 'Not provided'}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-6 border border-[#3ec489]/20 hover:border-[#3ec489]/40 transition-colors">
              <h3 className="text-[#3ec489] text-sm font-medium">Last Sign In</h3>
              <p className="text-xl font-semibold mt-2 text-white/90">
                {new Date(user.last_sign_in_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* User Data Section */}
          <div className="bg-black/40 rounded-xl p-6 border border-[#3ec489]/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <svg className="w-5 h-5 text-[#3ec489]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              User Details
            </h2>
            <div className="bg-black rounded-lg p-4 overflow-auto border border-[#3ec489]/10">
              <pre className="text-sm font-mono text-gray-300">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-end">
            <LogoutButton />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    redirect('/')
  }
}