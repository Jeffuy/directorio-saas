'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createItem(formData) {
	const supabase = await createClient()

	const title = formData.get('title')
	const description = formData.get('description')
	const website_url = formData.get('website_url')
	const directory_id = formData.get('directory_id')
	const slug = formData.get('slug')

	// 1. Manejo de la Imagen
	const imageFile = formData.get('image') // El input se llamará 'image'
	let image_url = null

	if (imageFile && imageFile.size > 0) {
		// Generamos un nombre único para no sobrescribir archivos (ej: 123-mifoto.jpg)
		const fileName = `${Date.now()}-${imageFile.name}`

		// Subir a Supabase Storage
		const { data, error: uploadError } = await supabase
			.storage
			.from('directory-images') // Nombre exacto del bucket
			.upload(fileName, imageFile, {
				cacheControl: '3600',
				upsert: false
			})

		if (uploadError) {
			console.error('Error subiendo imagen:', uploadError)
			// Podrías retornar un error aquí si quieres ser estricto
		} else {
			// Obtener la URL pública para guardarla en la BD
			const { data: publicData } = supabase
				.storage
				.from('directory-images')
				.getPublicUrl(fileName)

			image_url = publicData.publicUrl
		}
	}

	// 2. Insertar en Base de Datos (ahora con image_url)
	const { error } = await supabase
		.from('items')
		.insert([{
			title,
			description,
			website_url,
			directory_id,
			image_url // <--- Campo nuevo
		}])

	if (error) {
		console.error('Error creando item:', error)
		return
	}

	revalidatePath(`/dashboard/${slug}`)
}

export async function deleteItem(formData) {
	const supabase = await createClient()

	const id = formData.get('id')
	const slug = formData.get('slug') // Necesario para saber qué página refrescar

	const { error } = await supabase
		.from('items')
		.delete()
		.eq('id', id)

	if (error) {
		console.log(error)
		return
	}

	revalidatePath(`/dashboard/${slug}`)
}