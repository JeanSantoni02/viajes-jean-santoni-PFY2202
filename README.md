# Viajes Santoni — Agencia de viajes

Desarrollo Frontend II (PFY2202) · Experiencia 2 · Semana 5 — *Integrando nuestro frontend con backend* (sumativa).

Aplicación en **React + React Router + Tailwind CSS** donde los usuarios exploran destinos y, al seleccionar uno,
ven las opciones de **vuelos y hoteles** para planificar su viaje. Los datos vienen de un **backend mock** que expone
una **API REST** y una **API GraphQL**.

## Cómo ejecutar

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

`npm run dev` levanta **los dos servidores a la vez**:

| Servidor | URL |
|---|---|
| Frontend React (Vite) | http://localhost:5173 |
| Backend mock REST | http://localhost:4000/api/destinos |
| Backend mock GraphQL (con GraphiQL) | http://localhost:4000/graphql |

En **NetBeans**: File → Open Project → esta carpeta; luego clic derecho en `package.json` → *npm Scripts* → `dev`.

## Requisitos de la actividad y dónde se cumplen

| Requisito | Implementación |
|---|---|
| API REST mock para listar destinos, con país y actividades populares | `mock-server/server.js` (`GET /api/destinos`, `GET /api/destinos/:id`), datos en `mock-server/data/destinos.json`. Cliente: `src/api/rest.js` |
| API GraphQL mock para vuelos y hoteles por destino, con precios, fechas y disponibilidad | `mock-server/server.js` (schema `Vuelo`, `Hotel`, queries `vuelos(destinoId)`, `hoteles(destinoId)`), datos en `vuelos.json` y `hoteles.json`. Cliente: `src/api/graphql.js` |
| Seleccionar un destino y ver sus vuelos y hoteles | `src/pages/Destinos.jsx` → `src/pages/DetalleDestino.jsx` con pestañas `VuelosDestino.jsx` y `HotelesDestino.jsx` |
| Experiencia completa de planificación | Selección de vuelo + hotel y resumen con costo total en `src/pages/MiViaje.jsx` (estado global en `src/context/ViajeContext.jsx`) |
| React Router | `src/App.jsx`: rutas, **rutas anidadas** (`/destinos/:id/vuelos`, `/destinos/:id/hoteles`), `useParams`, `useSearchParams`, `NavLink`, `Outlet`, `Navigate` |
| HTML, JavaScript, CSS | React (JSX) + Tailwind CSS |

## API REST

```
GET /api/destinos                      -> todos los destinos
GET /api/destinos?continente=Europa    -> filtrados por continente
GET /api/destinos?q=peru               -> búsqueda por ciudad o país
GET /api/destinos/1                    -> un destino
```

## API GraphQL — ejemplo de consulta

```graphql
query VuelosPorDestino($destinoId: ID!, $soloDisponibles: Boolean) {
  vuelos(destinoId: $destinoId, soloDisponibles: $soloDisponibles) {
    aerolinea fechaSalida fechaRegreso precio asientosDisponibles disponible
  }
  hoteles(destinoId: $destinoId) {
    nombre estrellas precioPorNoche disponibleDesde disponibleHasta habitacionesDisponibles disponible
  }
}
```

Variables: `{ "destinoId": "1", "soloDisponibles": true }`

## Estructura

```
mock-server/          Backend mock (Express + GraphQL Yoga)
  data/               destinos.json, vuelos.json, hoteles.json
  server.js           API REST + API GraphQL
src/
  api/                rest.js y graphql.js (clientes de las APIs)
  components/         Layout, TarjetaDestino, estados de carga/error, filtros
  context/            ViajeContext (plan de viaje del usuario)
  pages/              Inicio, Destinos, DetalleDestino, VuelosDestino, HotelesDestino, MiViaje
  utils/              formato de precios/fechas y hook useAsync
```
