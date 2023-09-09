import FoodsAndMeals from "./components/FoodsAndMeals";
import MealRoutines from "./components/Routines";
import { Home } from "./components/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FoodForm from "./components/FoodForm";
import MealForm from "./components/MealForm";
import RoutineForm from "./components/RoutineForm";
import FoodsView from "./components/FoodsView";
import MealsView from "./components/MealsView";
import Settings from "./components/Settings";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/register',
        element: <RegisterForm />
    },
    {
        path: '/login',
        element: <LoginForm />
    },
    {
        path: '/settings',
        element: <Settings />
    },
    {
        path: '/foods-and-meals',
        element: <FoodsAndMeals />
    },
    {
        path: '/foods-view',
        element: <FoodsView />
    },
    {
        path: '/meals-view',
        element: <MealsView />
    },
    {
        path: '/meal-routines',
        element: <MealRoutines />
    },
    {
        path: '/food-form',
        element: <FoodForm />
    },
    {
        path: '/meal-form',
        element: <MealForm />
    },
    {
        path: '/routine-form',
        element: <RoutineForm />
    }
];

export default AppRoutes;
