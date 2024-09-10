<template>
  <h1 class="quiz__title">Liste des quiz</h1>
  <div v-if="loading">Loading...</div>
  <div v-if="list">
    <div class="quiz-cards">
      <div class="quiz-card" v-for="item in list.data">
        <div>
          <RouterLink class="link-secondary" :to="{ name: 'category', params: { id: item.attributes.category.data.id } }">{{ item.attributes.category.data.attributes.name }}{{ item.attributes.subcategory.data ? ' - ' + item.attributes.subcategory.data.attributes.name : null}}</RouterLink>
          <h2 class="quiz-card__title">{{ item.attributes.name }}</h2>
          <RouterLink class="quiz-card__btn" :to="{ name: 'single-quiz', params: { id: item.id }}">Commencer</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useFetch} from "../composables/fetch.ts";

  const { data: list, loading } = useFetch(`http://localhost:1337/api/quizzes?populate=*`)
</script>

<style lang="scss">
.quiz__title {
  margin: 1.6rem 0;
}

.quiz-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.2rem;
}

.quiz-card {
  background-color: #fff;
  border-radius: 1rem;
  color: #000;
  position: relative;
  transition: background-color .2s ease-in-out;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 1rem;
    transition: transform .2s ease-in-out;
  }

  &:hover > div {
    transform: translate(-10px, -10px);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.56);
  }
}

.quiz-card__btn {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  opacity: 0;
}
</style>
