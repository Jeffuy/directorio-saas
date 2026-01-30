import { login } from './actions'

// 1. Convertimos la función en async
export default async function LoginPage(props) {
  // 2. Esperamos (await) a que lleguen los searchParams
  const searchParams = await props.searchParams
  const message = searchParams?.message

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        
        {/* Usamos la variable message que extrajimos arriba */}
        {message && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded border border-red-200 text-center">
            {message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={login}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}