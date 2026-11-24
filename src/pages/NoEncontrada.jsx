import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <div className="py-16 text-center">
      <p className="text-6xl font-bold text-sky-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Página no encontrada</h1>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700">
        Volver al inicio
      </Link>
    </div>
  );
}
