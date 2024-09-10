<template>
  <div class="single-quiz__start" v-if="!startQuiz">
    <div v-if="quiz">
      <h1>{{ quiz.data.attributes.name }}</h1>
    </div>
    <p>Commencer le quiz ?</p>
    <div class="single-quiz__start-actions">
      <button class="btn" @click="startQuiz = true">Commencer</button>
      <RouterLink class="link" :to="{ name: 'home' }">Revenir à la liste</RouterLink>
    </div>
  </div>
  <div v-else>
    <div v-if="quiz">
      <div class="quiz__intro">
        <h1>{{ quiz.data.attributes.name }}</h1>
        <h2 :class="answered === '' && timer > 0 && 'quiz__timer'">{{ timer }}</h2>
      </div>
      <div v-for="element in quiz.data.attributes.questions" :key="element.id">
        <div v-if="quiz.data.attributes.questions.indexOf(element) === currentStep -1">
          <p class="quiz__question">{{ currentStep }}/{{ quiz.data.attributes.questions.length }} {{ element.question }}</p>
          <ul class="quiz__proposals-list">
            <TransitionGroup name="quiz-proposals" appear>
              <li v-for="(propo, i) in element.proposals" :key="propo" :style="{'--i': i}">
                <button
                    :disabled="answered != ''"
                    :class="`quiz__proposal ${getProposalClass(element, propo.proposal)}`"
                    @click="isCorrect(element.answer, propo.proposal)"
                >
                  {{ propo.proposal }}
                </button>
              </li>
            </TransitionGroup>
          </ul>

          <Transition name="quiz-result">
            <div class="quiz__result" v-if="answered != ''">
              <h2 v-if="timer === 0" class="quiz__error-message">Aïe, le temps est écoulé... La bonne réponse était "{{ element.answer }}"</h2>
              <h2 v-else :class="correct ? 'quiz__correct-message' : 'quiz__error-message'">{{ correct ? 'Vrai !' : `Faux, la bonne réponse était "${element.answer}"` }}</h2>
              <p>{{ currentStep === quiz.data.attributes.questions.length ? 'Score final :' : 'Score :' }} {{ totalCorrect }}/{{ quiz.data.attributes.questions.length }}</p>
            </div>
          </Transition>

          <div class="quiz__next-btn">
            <button v-if="currentStep < quiz.data.attributes.questions.length" class="btn" @click="currentStep++" :disabled="answered === ''">Question suivante</button>
            <RouterLink class="link" :to="{ name: 'home' }">Quitter</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
  import {useFetch} from "../composables/fetch.ts";
  import {useRoute} from "vue-router";
  const route = useRoute()

  let timerRun: any = null
  const startQuiz = ref(false)
  const timer = ref(10)
  const currentStep = ref(1)
  const answered = ref('')
  const correct = ref(false)
  const totalCorrect = ref(0)

  const { data: quiz } = useFetch(`http://localhost:1337/api/quizzes/${route.params.id}?populate[0]=questions&populate[1]=questions.proposals`)

  const startTimer = () => {
    timerRun = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
      }
    }, 1000)
  }

  onUnmounted(() => {
    clearInterval(timerRun);
  })

  watchEffect(() => {
    if (startQuiz.value) {
      startTimer()
    }
  })

  watch(timer, () => {
    if (timer.value === 0) {
      answered.value = 'test'
      correct.value = false
    }
  })

  watch(currentStep, () => {
    clearInterval(timerRun);
    timer.value = 10;
    startTimer()
    answered.value = ''
    correct.value = false
  })

  const isCorrect = (answer: string, proposal: string) => {
    console.log(answer, proposal)
    clearInterval(timerRun);
    answered.value = proposal
    if (answer === proposal) {
      correct.value = true
      totalCorrect.value++
    }
  }

  const getProposalClass = (question: string, proposal: string) => {
    return answered.value === proposal && correct.value ? 'quiz__btn-true' : answered.value === proposal && !correct.value ? 'quiz__btn-false' : answered.value && answered.value !== proposal && proposal === question.answer ? 'quiz__btn-real-true' : answered.value && 'quiz__btn-disabled'
  }

</script>

<style lang="scss">
.single-quiz__start {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;
}

.single-quiz__start-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quiz__intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.quiz__timer {
  animation: .5s ease-out infinite alternate bounce;
}

@keyframes bounce {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(2);
  }
}

.quiz__question {
  margin-bottom: 1rem;
}

.quiz__proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz__proposal {
  box-shadow: 0 0 0 1px #000;
  background-color: #fff;
  color: #000;
  padding: 1rem;
  transition: all .3s ease;
  text-decoration: none;
  border: 0;
  width: 100%;

  &:disabled {
    pointer-events: none;
  }

  &:hover {
    cursor: pointer;
    opacity: .8;
  }
}

.quiz__result {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.quiz__btn-true {
  background-color: #42bb42;
}

.quiz__btn-real-true {
  background-color: rgb(217 255 217);
}

.quiz__btn-false {
  background-color: #e93333;
}

.quiz__btn-disabled {
  opacity: .5;
}

.quiz__next-btn {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quiz__error-message {
  color: #e93333;
}

.quiz__correct-message {
  color: #42bb42;
}

.quiz-result-move,
.quiz-result-enter-active,
.quiz-result-leave-active {
  transition: opacity .5s ease;
}

.quiz-result-enter-from,
.quiz-result-leave-to {
  opacity: 0;
}

.quiz-proposals-enter-active {
  transition: opacity .5s linear, transform .5s cubic-bezier(.2,.5,.1,1);
  transition-delay: calc( 0.1s * var(--i) );
}
.quiz-proposals-enter-from {
  opacity: 0;
}
.quiz-proposals-enter-from {
  transform: translateX(-1rem);
}
.quiz-proposals-leave-to {
  transform: translateX(1rem);
}
</style>
