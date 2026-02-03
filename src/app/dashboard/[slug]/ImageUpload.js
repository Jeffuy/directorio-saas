'use client' // <--- Esto es clave: permite usar useState

import { useState } from 'react'

export default function ImageUpload() {
	const [preview, setPreview] = useState(null)

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			// Creamos una URL temporal para mostrar la imagen inmediatamente
			const objectUrl = URL.createObjectURL(file)
			setPreview(objectUrl)
		}
	}

	return (
		<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
			<input
				type="file"
				name="image"
				accept="image/*"
				onChange={handleFileChange}
				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			// Usamos opacity-0 en vez de hidden para que siga funcionando el drag & drop nativo
			/>

			{preview ? (
				<div className="flex flex-col items-center">
					<div className="w-32 h-32 rounded-lg overflow-hidden border mb-2 relative shadow-sm">
						<img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
					</div>
					<p className="text-green-600 text-sm font-semibold">✅ Imagen seleccionada</p>
					<p className="text-xs text-gray-400">(Haz clic para cambiarla)</p>
				</div>
			) : (
				<div className="flex flex-col items-center py-2">
					<span className="text-3xl mb-2">📸</span>
					<span className="text-gray-600 text-sm font-medium">Subir foto de portada</span>
					<span className="text-gray-400 text-xs mt-1">JPG, PNG, WebP</span>
				</div>
			)}
		</div>
	)
}