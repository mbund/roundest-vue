<template>
  <div>
    {{ name }} ({{ id }})
    <div class="w-[200px] h-[200px] bg-red">
      <img width="200" height="200" :title="`Vote for ${name} (${id}), ${props.elo} ELO`" :src="imageUrl">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computedAsync } from '@vueuse/core'

const props = defineProps({
  id: Number,
  elo: Number,
})

const pokemonData = computedAsync(async () => await ((await fetch(`https://pokeapi.co/api/v2/pokemon/${props.id}`)).json()), { name: "loading...", sprites: { front_default: "" } })
const name = computed(() => (pokemonData.value.name as string).replace(/./, c => c.toUpperCase()))
const imageUrl = computed(() => pokemonData.value.sprites.front_default as string)
const id = computed(() => pokemonData.value.id as number)
</script>
