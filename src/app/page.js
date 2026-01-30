import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // 1. Verificamos si el usuario ya tiene sesión
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Traemos algunos directorios de ejemplo para mostrar en la home (Marketing)
  // Mostramos los últimos 3 creados por cualquier usuario
  const { data: publicDirectories } = await supabase
    .from('directories')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Header / Navbar --- */}
      <header className="px-6 h-16 flex items-center justify-between border-b">
        <div className="font-bold text-xl tracking-tight">DirectorySaas 🚀</div>
        <nav className="flex gap-4">
          {user ? (
            <Link 
              href="/dashboard" 
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            >
              Ir a mi Dashboard
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </header>

      {/* --- Hero Section (La parte que vende) --- */}
      <main className="flex-1">
        <section className="py-20 text-center px-4 bg-gray-50">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Crea directorios curados <br className="hidden md:block" />
            <span className="text-blue-600">en cuestión de minutos.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            La herramienta perfecta para organizar recursos, lugares favoritos o listas de afiliados. 
            Sin programar, solo contenido de calidad.
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Link 
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Crear nuevo directorio →
              </Link>
            ) : (
              <Link 
                href="/login"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Comenzar Gratis
              </Link>
            )}
          </div>
        </section>

        {/* --- Explorar Directorios (Prueba Social) --- */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Explora directorios recientes</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {publicDirectories?.map((dir) => (
              <Link key={dir.id} href={`/d/${dir.slug}`} className="group">
                <div className="border rounded-xl p-6 hover:shadow-lg transition bg-white h-full flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl">
                      📂
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition">
                      {dir.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2">
                      /{dir.slug}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-blue-500 font-medium">
                    Ver directorio →
                  </div>
                </div>
              </Link>
            ))}

            {publicDirectories?.length === 0 && (
              <div className="col-span-3 text-center text-gray-400">
                Aún no hay directorios públicos. ¡Sé el primero!
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-8 border-t text-center text-gray-500 text-sm">
        <p>© 2026 DirectorySaas. Hecho desde Europa.</p>
      </footer>
    </div>
  )
}