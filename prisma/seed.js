import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const pokemon = await (await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=1025")).json();
  await prisma.pokemon.createMany({
    data: pokemon.results.map(p => ({
      name: p.name,
    }))
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
