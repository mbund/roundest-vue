import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const NUM_POKEMON = 1025;
const NUM_PER_PAGE = 20;

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    let page = query.page ? parseInt(query.page.valueOf().toString()) : 1;
    if (!Number.isInteger(page)) {
        page = 1;
    }
    page--;

    const offset = page * NUM_PER_PAGE;

    if (page < 0 || offset > NUM_POKEMON) {
        page = 0;
    }

    const pokemon = (await prisma.pokemon.findMany({
        orderBy: {
            elo: "desc"
        },
        take: NUM_PER_PAGE,
        skip: offset,
    })).map((p, i) => ({
        rank: (offset) + i + 1,
        ...p,
    }));

    return {
        top: pokemon,
        lastPage: Math.ceil(NUM_POKEMON / NUM_PER_PAGE)
    };
})
