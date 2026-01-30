'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDirectory(formData) {
  const supabase = await createClient()

  // 1. Obtener el usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No estás logueado')
  }

  // 2. Extraer datos del formulario
  const name = formData.get('name')
  // Creamos un slug simple reemplazando espacios por guiones (ej: "Mis Cafes" -> "mis-cafes")
  const slug = name.toLowerCase().replace(/\s+/g, '-')

  // 3. Insertar en Supabase
  const { error } = await supabase
    .from('directories')
    .insert([
      {
        name: name,
        slug: slug,
        user_id: user.id
      }
    ])

  if (error) {
    console.error('Error insertando:', error)
    return { message: 'Hubo un error al crear el directorio' }
  }

  // 4. Actualizar la vista y redirigir
  revalidatePath('/dashboard')
  redirect('/dashboard')
}