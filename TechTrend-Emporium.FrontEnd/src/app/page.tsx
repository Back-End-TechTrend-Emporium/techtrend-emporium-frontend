export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bienvenido a TechTrend Emporium
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre lo último en tecnología e innovación. Productos de alta calidad para tu estilo de vida digital.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg">
              Comprar Ahora
            </button>
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border border-blue-600 transition-colors shadow-lg">
              Ver Productos
            </button>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Últimos Gadgets</h3>
            <p className="text-gray-600">Explora nuestros dispositivos más recientes y innovadores.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Accesorios Premium</h3>
            <p className="text-gray-600">Complementa tu setup con accesorios de alta calidad.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Soporte Técnico</h3>
            <p className="text-gray-600">Nuestro equipo está aquí para ayudarte con cualquier consulta.</p>
          </div>
        </div>
      </div>
    </div>
  )
}