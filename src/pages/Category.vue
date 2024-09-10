<template>
    <div v-if="loading">loading...</div>
    <h1 v-if="category">{{ category.data.attributes.name }}</h1>
</template>

<script setup lang="ts">
import {useFetch} from "../composables/fetch.ts";
import {useRoute} from "vue-router";

const route = useRoute()

const { data: category, loading } = useFetch(`http://localhost:1337/api/categories/${route.params.id}?populate=*`)
</script>

<style lang="scss">

</style>
