import { createApp } from 'vue'
import './assets/style.scss'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import { routes } from './routes.ts'

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')

