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
						<div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
									<p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
								</div>
								{item.website_url && (
									<a
										href={item.website_url}
										target="_blank"
										rel="noopener noreferrer" // Seguridad extra al abrir links externos
										className="ml-4 shrink-0 bg-gray-100 text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200"
									>
										Visitar ↗
									</a>
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