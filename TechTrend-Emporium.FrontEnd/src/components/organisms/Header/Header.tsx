import SearchBar from '@molecules/SearchBar/SearchBar'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-white font-bold text-2xl">TechTrend</div>
          <div className="flex items-center space-x-6">
            <SearchBar placeholder="Buscar productos..." />
            <div className="flex space-x-4">
              <a href="/" className="text-white hover:text-blue-200 transition-colors">Inicio</a>
              <a href="/shop" className="text-white hover:text-blue-200 transition-colors">Tienda</a>
              <a href="/about" className="text-white hover:text-blue-200 transition-colors">Acerca de</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}