/* eslint-disable @typescript-eslint/no-unused-vars */
import supabase from '@/lib/supabase/supabase'
import supabaseAdmin from '@/lib/supabase/supabaseAdmin'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error('Set Cookie error (CALLBACK):', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              console.error('Remove cookie error (CALLBACK):', error)
            }
          },
        },
      }
    )

    try {
      await supabase.auth.exchangeCodeForSession(code)

      const { data: session } = await supabase.auth.getSession()
      const { data: user } = await supabase.auth.getUser()
      
      const { data, error } = await supabaseAdmin.from('users').upsert([
        {
          id: user.user?.id, 
          username: user.user?.user_metadata?.full_name || user.user?.email,
          email: user.user?.email, 
          avatar_url: user.user?.user_metadata?.avatar_url, 
          acessToken: session?.session?.provider_token, 
          refreshToken: session?.session?.refresh_token 
        },
      ])

      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/error', requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}