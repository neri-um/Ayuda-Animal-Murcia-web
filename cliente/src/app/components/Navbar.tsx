// cliente/src/app/components/Navbar.tsx

export default function Navbar() {
  return (
    <header className="bg-fondoBlanco border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-bold text-negroCarbon text-lg">Ayuda Animal Murcia</a>
        <nav className="flex items-center gap-6 text-sm font-medium text-negroCarbon">
          <a href="/" className="hover:text-dorado">Inicio</a>
          <a href="/adoptar" className="hover:text-dorado">Adoptar</a>
          <div className="relative group">
            <button className="hover:text-dorado">Formas de colaborar</button>
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-fondoBlanco shadow-lg rounded-xl py-2 min-w-[200px] border border-gray-200">
              <a href="/colaborar" className="block px-4 py-2 text-sm hover:bg-fondo">Colaborar</a>
              <a href="/donar" className="block px-4 py-2 text-sm hover:bg-fondo">Donar</a>
              <a href="/apadrinar" className="block px-4 py-2 text-sm hover:bg-fondo">Apadrinar</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
