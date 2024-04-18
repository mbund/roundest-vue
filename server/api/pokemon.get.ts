import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const NUM_POKEMON = 1025;
const RANGE = 50;

export default defineEventHandler(async () => {
    // select two similarly ranked in elo pokemon
    const start = random(NUM_POKEMON - RANGE);
    const offset = random(RANGE - 2) + 2;

    const [pokemon1, pokemon2] = await prisma.pokemon.findMany({
        orderBy: { elo: "desc" },
        where: {
            id: {
                in: [start, start + offset]
            }
        }
    });

    const matchup = await prisma.matchup.create({
        data: {
            pokemonId1: pokemon1.id,
            pokemonId2: pokemon2.id,
        }
    });

    return {
        pokemon1: pokemon1!,
        pokemon2: pokemon2!,
        matchupId: matchup.id,
    }
})

const random = (max: number) => Math.floor(Math.random() * (max + 1))
