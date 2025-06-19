// app/api/create-user/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

export async function POST(req: Request) {
  const userData = await req.json()
  const { email, password, name, department_code, agency_code, role, username } = userData

  try {
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    })

    if (signUpError) throw signUpError

    const { user } = signUpData
    if (user) {
      const { data: user_data, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: user.id,
          name,
          email,
          password,
          role,
          username,
          department_code: department_code || null,
          agency_code: agency_code || null,
        })
        .select("*")
        .single()

      if (insertError) throw insertError
      return NextResponse.json(user_data, { status: 200 })
    }

    return NextResponse.json({ error: 'User creation failed' }, { status: 500 })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
