import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

// Esto permite a Next.js generar estas páginas de forma estática para que carguen INSTANTÁNEO
export async function generateMetadata({ params }) {
	const { slug } = await params
	return { title: `Directorio: ${slug}` }
}

export default async function PublicDirectoryPage(props) {
	const params = await props.params
	const slug = params.slug
	const supabase = await createClient()

	// 1. Obtener el directorio (Esta vez no filtramos por usuario, cualquiera puede verlo)
	const { data: directory } = await supabase
		.from('directories')
		.select('*')
		.eq('slug', slug)
		.single()

	if (!directory) return notFound()

	// 2. Obtener los items
	const { data: items } = await supabase
		.from('items')
		.select('*')
		.eq('directory_id', directory.id)
		.order('created_at', { ascending: false })

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Hero */}
			<div className="bg-black text-white py-12">
				<div className="max-w-3xl mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">{directory.name}</h1>
					<p className="text-gray-400 text-lg">Explora nuestra selección curada</p>
				</div>
			</div>

			{/* Lista de Resultados */}
			<div className="max-w-3xl mx-auto px-4 py-12">
				<div className="grid gap-6">
					{items?.map((item) => (
						<div key={item.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row">

							{/* --- ZONA DE FOTO --- */}
							{item.image_url && (
								<div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-100 relative">
									<img
										src={item.image_url}
										alt={item.title}
										className="w-full h-full object-cover absolute inset-0"
									/>
								</div>
							)}

							{/* --- ZONA DE CONTENIDO --- */}
							<div className="p-6 flex-1 flex flex-col justify-between">
								<div>
									<h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
									<p className="text-gray-600 mt-2 leading-relaxed line-clamp-3">
										{item.description}
									</p>
								</div>

								{item.website_url && (
									<div className="mt-4 pt-4 border-t border-gray-100">
										<a
											href={item.website_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 font-medium text-sm hover:underline inline-flex items-center gap-1"
										>
											Visitar sitio web ↗
										</a>
									</div>
								)}
							</div>

						</div>
					))}

					{items?.length === 0 && (
						<div className="text-center py-20 text-gray-500">
							<p className="text-xl">Este directorio aún se está construyendo.</p>
						</div>
					)}
				</div>
			</div>

			{/* Footer simple */}
			<footer className="text-center py-8 text-gray-400 text-sm">
				Creado con Directory SaaS
			</footer>
		</div>
	)
}