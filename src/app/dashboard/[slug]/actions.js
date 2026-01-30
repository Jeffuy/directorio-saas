'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createItem(formData) {
  const supabase = await createClient()

  const title = formData.get('title')
  const description = formData.get('description')
  const website_url = formData.get('website_url')
  const directory_id = formData.get('directory_id')
  const slug = formData.get('slug') // Necesario para refrescar la página correcta

  const { error } = await supabase
    .from('items')
    .insert([{
      title,
      description,
      website_url,
      directory_id
    }])

  if (error) {
    console.error('Error creando item:', error)
    return 
  }

  // Refrescamos solo la página de ESTE directorio
  revalidatePath(`/dashboard/${slug}`)
}