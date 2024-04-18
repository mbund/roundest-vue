<template>
  <img :src="imageUrl">
</template>

<script lang="ts" setup>
import { computedAsync } from '@vueuse/core'

const props = defineProps({
  id: Number,
})

const pokemonData = computedAsync(async () => await ((await fetch(`https://pokeapi.co/api/v2/pokemon/${props.id}`)).json()), { name: "loading...", sprites: { front_default: "" } })
const imageUrl = computed(() => pokemonData.value.sprites.front_default as string)
</script>
