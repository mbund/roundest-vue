<script setup lang="ts">
const { data, refresh } = await useFetch("/api/pokemon")

async function vote(winnerPokemonId: number) {
  await $fetch("/api/vote", {
    method: "POST",
    body: {
      winnerPokemonId,
      matchupId: data.value?.matchupId,
    },
    async onResponseError() {
      await refresh();
    }
  })
  await refresh();
}
</script>

<template>
  <div class="h-full min-h-screen w-screen flex flex-col items-center justify-between">
    <div class="flex flex-col grow justify-center">
      <h1 class="flex justify-center mb-3">Which Pokémon is rounder?</h1>
      <div v-if="data" class="flex gap-8">
        <button @click="vote(data.pokemon1.id)">
          <VotePokemon v-bind="data.pokemon1" />
        </button>
        <button @click="vote(data.pokemon2.id)">
          <VotePokemon v-bind="data.pokemon2" />
        </button>
      </div>
    </div>
    <div class="mb-4">
      <NuxtLink to="/leaderboard">Leaderboard</NuxtLink>
    </div>
  </div>
</template>
