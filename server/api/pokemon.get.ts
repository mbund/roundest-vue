import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const NUM_POKEMON = 1025;
const RANGE = 50;

export default defineEventHandler(async () => {
    // select two similarly ranked in elo pokemon
    const start = random(NUM_POKEMON - RANGE);
    const offset = random(RANGE - 1) + 1;

    const pokemon1 = await prisma.pokemon.findFirstOrThrow({
        orderBy: { elo: "desc" },
        skip: start
    });

    const pokemon2 = await prisma.pokemon.findFirstOrThrow({
        orderBy: { elo: "desc" },
        skip: start + offset
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
