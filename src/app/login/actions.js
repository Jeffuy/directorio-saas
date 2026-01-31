'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// ⚠️ Fíjate aquí: SOLO "export", NO "export default"
export async function login(formData) {
	const supabase = await createClient()

	const email = formData.get('email')
	const password = formData.get('password')

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return redirect('/login?message=No se pudo iniciar sesion')
	}

	revalidatePath('/', 'layout')
	redirect('/dashboard')
}