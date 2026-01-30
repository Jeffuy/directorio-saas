import { createClient } from '@/utils/supabase/server'
import { createItem } from './actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function DirectoryPage(props) {
  // En Next.js 15, params es una promesa que hay que esperar
  const params = await props.params
  const slug = params.slug

  const supabase = await createClient()

  // 1. Buscamos el directorio (necesitamos su ID para guardar items)
  const { data: directory } = await supabase
    .from('directories')
    .select('*')
    .eq('slug', slug)
    .single()

  // Si no existe (ej: /dashboard/algo-inventado), mostramos error 404
  if (!directory) {
    return notFound()
  }

  // 2. Buscamos los items que ya existen en este directorio
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('directory_id', directory.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Volver a mis directorios
        </Link>
        <h1 className="text-4xl font-bold mt-2">{directory.name}</h1>
		<div className="flex items-center gap-4 mt-4 mb-8">
          <a 
            href={`/d/${directory.slug}`} 
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
          >
            🌐 Ver página pública en vivo
          </a>
        </div>
      </div>

      {/* Formulario para agregar Items */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border">
        <h3 className="font-semibold mb-4 text-lg">Agregar nuevo item</h3>
        <form action={createItem} className="space-y-4">
          {/* Inputs ocultos para pasarle el ID y Slug a la server action */}
          <input type="hidden" name="directory_id" value={directory.id} />
          <input type="hidden" name="slug" value={directory.slug} />

          <div className="grid gap-4">
            <input
              name="title"
              placeholder="Nombre del lugar (Ej: Pizza Hut)"
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Breve descripción..."
              className="w-full border p-2 rounded"
              rows="2"
            />
            <input
              name="website_url"
              placeholder="https://..."
              className="w-full border p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Guardar Item
          </button>
        </form>
      </div>

      {/* Lista de Items existentes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Listado ({items?.length || 0})</h3>
        
        {items?.map((item) => (
          <div key={item.id} className="border p-4 rounded bg-white shadow-sm flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-gray-600 mt-1">{item.description}</p>
              {item.website_url && (
                <a 
                  href={item.website_url} 
                  target="_blank" 
                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >
                  Visitar sitio web ↗
                </a>
              )}
            </div>
          </div>
        ))}

        {items?.length === 0 && (
          <p className="text-gray-500 italic">No hay items todavía. ¡Agrega el primero!</p>
        )}
      </div>
    </div>
  )
}