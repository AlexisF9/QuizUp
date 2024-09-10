import Home from "./pages/Home.vue";
import NotFound from "./pages/NotFound.vue";
import SingleQuiz from "./pages/SingleQuiz.vue";
import Category from "./pages/Category.vue";

export const routes = [
    {
        path: '/',
        component: Home,
        name: 'home'
    },
    {
        path: '/category/:id',
        component: Category,
        name: 'category'
    },
    {
        path: '/quiz/:id',
        component: SingleQuiz,
        name: 'single-quiz'
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    },
]