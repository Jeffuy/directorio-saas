import { createClient } from '@/utils/supabase/server'
import { createDirectory } from './actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
	const supabase = await createClient()

	// 1. Seguridad: Verificar sesión
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) {
		return redirect('/login') // Si no hay usuario, fuera.
	}

	// 2. Leer datos: Traer los directorios de ESTE usuario
	const { data: directories } = await supabase
		.from('directories')
		.select('*')
		.order('created_at', { ascending: false })

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Mis Directorios</h1>
				<span className="text-sm text-gray-500">{user.email}</span>
			</div>

			{/* Formulario de Creación */}
			<div className="bg-white p-6 rounded-lg shadow mb-8 border">
				<h2 className="text-xl font-semibold mb-4">Crear Nuevo Directorio</h2>
				<form action={createDirectory} className="flex gap-4">
					<input
						name="name"
						type="text"
						placeholder="Ej: Cafés en Berlín"
						className="flex-1 border p-2 rounded"
						required
					/>
					<button
						type="submit"
						className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
					>
						Crear
					</button>
				</form>
			</div>

			{/* Lista de Resultados */}
			<div className="grid gap-4">
				{directories?.map((dir) => (
					<Link href={`/dashboard/${dir.slug}`} key={dir.id} className="block">
						<div className="border p-4 rounded hover:bg-gray-50 flex justify-between cursor-pointer transition-colors">
							{/* ... el resto de tu contenido actual ... */}
							<div>
								<h3 className="font-bold">{dir.name}</h3>
								<p className="text-sm text-gray-500">/{dir.slug}</p>
							</div>
							<div className="text-sm text-gray-400">
								{new Date(dir.created_at).toLocaleDateString()}
							</div>
						</div>
					</Link>
				))}

				{directories?.length === 0 && (
					<p className="text-center text-gray-500 py-10">
						No tienes directorios aún. ¡Crea el primero arriba!
					</p>
				)}
			</div>
		</div>
	)
}