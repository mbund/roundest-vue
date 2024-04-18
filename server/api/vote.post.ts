import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const K_FACTOR = 32;

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const matchup = await verifyMatchup(body.matchupId);

  const winnerPokemonId = body.winnerPokemonId as number | undefined;
  if (!winnerPokemonId) {
    throw createError({
      statusCode: 401,
      statusMessage: "No winner pokemon ID provided"
    })
  }

  if (![matchup.pokemonId1, matchup.pokemonId2].includes(winnerPokemonId)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Winner pokemon ID not included in matchup"
    })
  }

  const winner = winnerPokemonId === matchup.pokemonId1 ? matchup.pokemon1 : matchup.pokemon2;
  const loser = winnerPokemonId === matchup.pokemonId1 ? matchup.pokemon2 : matchup.pokemon1;

  const expectedOutcome = 1 / (1 + 10 ** ((loser.elo - winner.elo) / 400));

  const newWinnerElo = winner.elo + K_FACTOR * (1 - expectedOutcome);
  const newLoserElo = loser.elo + K_FACTOR * (0 - (1 - expectedOutcome));

  await prisma.pokemon.update({
    where: {
      id: winner.id,
    },
    data: {
      elo: newWinnerElo
    }
  })

  await prisma.pokemon.update({
    where: {
      id: loser.id,
    },
    data: {
      elo: newLoserElo
    }
  })

  // timeout matchups that are an hour old
  await prisma.matchup.deleteMany({
    where: {
      createdAt: {
        lte: new Date(new Date().getTime() - 60 * 60 * 1 * 1000)
      }
    }
  })
})

async function verifyMatchup(matchupId: string | undefined) {
  if (!matchupId) {
    throw createError({
      statusCode: 401,
      statusMessage: "No matchup ID provided"
    })
  }

  try {
    const matchup = await prisma.matchup.delete({
      where: {
        id: matchupId,
      },
      include: {
        pokemon1: { select: { id: true, elo: true } },
        pokemon2: { select: { id: true, elo: true } },
      }
    })
    return matchup;
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid matchup ID"
    })
  }
}
