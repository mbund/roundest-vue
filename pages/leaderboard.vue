<template>
  <div class="h-full w-screen flex flex-col items-center gap-4 my-4">
    <div class="flex gap-3 text-2xl">
      <NuxtLink :class="{ disabled: page <= 1 }" :to="`/leaderboard`">&lt;&lt;</NuxtLink>
      <NuxtLink :class="{ disabled: page <= 1 }" :to="`/leaderboard?page=${page - 1}`">&lt;</NuxtLink>
      <NuxtLink :class="{ disabled: pokemon && page >= pokemon.lastPage }" :to="`/leaderboard?page=${page + 1}`">&gt;
      </NuxtLink>
      <NuxtLink :class="{ disabled: pokemon && page >= pokemon.lastPage }"
        :to="`/leaderboard?page=${pokemon?.lastPage}`">
        &gt;&gt;
      </NuxtLink>
    </div>
    <div class="flex flex-col w-full max-w-2xl border">
      <div v-for="p in pokemon?.top">
        <div class="flex border-b px-4 items-center justify-between">
          <div class="flex items-center gap-4">
            {{ p.rank }}.
            <a :href="`https://pokemondb.net/pokedex/${p.id}`">
              <PokemonImage :id="p.id" />
            </a>
            <a :href="`https://pokemondb.net/pokedex/${p.id}`">{{ p.name.replace(/./, c => c.toUpperCase()) }}</a>
          </div>
          <div>{{ p.elo }} Elo</div>
        </div>
      </div>
    </div>
    <div>
      <NuxtLink to="/">Vote...</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const page = computed(() => route.query.page ? parseInt(route.query.page!.toString()) : 1);

const { data: pokemon } = await useLazyFetch(`/api/leaderboard`, {
  query: {
    page
  }
})
</script>

<style>
.disabled {
  @apply text-gray-400 pointer-events-none;
}
</style>
