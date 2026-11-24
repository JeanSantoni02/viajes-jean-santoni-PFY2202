/*
 * Backend MOCK de la agencia de viajes.
 *  - API REST    -> http://localhost:4000/api/destinos       (destinos, país y actividades populares)
 *  - API GraphQL -> http://localhost:4000/graphql            (vuelos y hoteles por destino)
 *
 * Los datos se leen desde archivos JSON en ./data (no hay base de datos real).
 */
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'node:fs';
import { createSchema, createYoga } from 'graphql-yoga';

const PUERTO = 4000;
const leerJSON = (archivo) => JSON.parse(readFileSync(new URL(`./data/${archivo}`, import.meta.url), 'utf-8'));

const destinos = leerJSON('destinos.json');
const vuelos = leerJSON('vuelos.json');
const hoteles = leerJSON('hoteles.json');

const app = express();
app.use(cors());

// Simula la latencia de un servidor real
app.use((req, res, next) => setTimeout(next, 300));

/* ============================ API REST ============================ */

// GET /api/destinos?continente=Sudamérica&q=texto
app.get('/api/destinos', (req, res) => {
  const { continente, q } = req.query;
  let resultado = destinos;
  if (continente) resultado = resultado.filter((d) => d.continente === continente);
  if (q) {
    const texto = String(q).toLowerCase();
    resultado = resultado.filter(
      (d) => d.ciudad.toLowerCase().includes(texto) || d.pais.toLowerCase().includes(texto)
    );
  }
  res.json(resultado);
});

// GET /api/destinos/:id
app.get('/api/destinos/:id', (req, res) => {
  const destino = destinos.find((d) => d.id === Number(req.params.id));
  if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
  res.json(destino);
});

/* ============================ API GraphQL ============================ */

const typeDefs = /* GraphQL */ `
  type Destino {
    id: ID!
    ciudad: String!
    pais: String!
  }

  type Vuelo {
    id: ID!
    destino: Destino!
    aerolinea: String!
    origen: String!
    fechaSalida: String!
    fechaRegreso: String!
    duracion: String!
    escalas: Int!
    precio: Int!
    asientosDisponibles: Int!
    disponible: Boolean!
  }

  type Hotel {
    id: ID!
    destino: Destino!
    nombre: String!
    estrellas: Int!
    precioPorNoche: Int!
    disponibleDesde: String!
    disponibleHasta: String!
    habitacionesDisponibles: Int!
    disponible: Boolean!
    servicios: [String!]!
  }

  type Query {
    "Vuelos hacia un destino. soloDisponibles=true excluye los vuelos sin asientos."
    vuelos(destinoId: ID!, soloDisponibles: Boolean = false): [Vuelo!]!
    "Hoteles de un destino. soloDisponibles=true excluye los hoteles sin habitaciones."
    hoteles(destinoId: ID!, soloDisponibles: Boolean = false): [Hotel!]!
    vuelo(id: ID!): Vuelo
    hotel(id: ID!): Hotel
  }
`;

const resolvers = {
  Query: {
    vuelos: (_, { destinoId, soloDisponibles }) =>
      vuelos.filter(
        (v) => v.destinoId === Number(destinoId) && (!soloDisponibles || v.asientosDisponibles > 0)
      ),
    hoteles: (_, { destinoId, soloDisponibles }) =>
      hoteles.filter(
        (h) => h.destinoId === Number(destinoId) && (!soloDisponibles || h.habitacionesDisponibles > 0)
      ),
    vuelo: (_, { id }) => vuelos.find((v) => v.id === id) ?? null,
    hotel: (_, { id }) => hoteles.find((h) => h.id === id) ?? null
  },
  Vuelo: {
    destino: (v) => destinos.find((d) => d.id === v.destinoId),
    disponible: (v) => v.asientosDisponibles > 0
  },
  Hotel: {
    destino: (h) => destinos.find((d) => d.id === h.destinoId),
    disponible: (h) => h.habitacionesDisponibles > 0
  }
};

// graphql-yoga incluye GraphiQL: abrir http://localhost:4000/graphql en el navegador para probar consultas
const yoga = createYoga({ schema: createSchema({ typeDefs, resolvers }), graphqlEndpoint: '/graphql' });
app.use(yoga.graphqlEndpoint, yoga);

app.listen(PUERTO, () => {
  console.log(`Backend mock listo:`);
  console.log(`  REST    -> http://localhost:${PUERTO}/api/destinos`);
  console.log(`  GraphQL -> http://localhost:${PUERTO}/graphql`);
});
