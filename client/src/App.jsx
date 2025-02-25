import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from './components/home/Home'
import Recipes from './components/recipes/Recipes'
import Recipe from './components/recipe/Recipe'
import Auth from './components/auth/Auth'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import RecipeRoulette from './components/recipe-roulette/RecipeRoulette'
import Saved from './components/saved/Saved'
import Community from './components/community/Community'
import RoutingError from './components/RoutingError'
import CoolAI from './components/ai-ingredients/CoolAI'
import CoolAIFull from './components/ai-ingredients/CoolAIFull'
//import './App.css'



function App() {
  const browserRouter = createBrowserRouter([
    {
      path : '/',
      element : <RootLayout/>,
      errorElement : <RoutingError/>,
      children:[
        {
          path : '/',
          element : <Home/>
        },
        {
              path : '/recipes',
              element : <Recipes/>
         },
        // {
        //   path : '/join-us',
        //   element : <Auth/>,
        //   children : [
        //     {
        //       path : '/login',
        //       element : <Login />
        //     },
        //     {
        //       path : '/register',
        //       element : <Register />
        //     },    
        //   ]
        // },
           {
               path : '/login',
               element : <Login />
             },
             {
              path : '/register',
              element : <Register />
            },
        {
          path : '/recipe-roulette',
          element : <RecipeRoulette/>
        },
        {
          path: '/recipe', // Route for recipe details
          element: <Recipe /> // Component to render for recipe details
        },
        {
          path : '/saved',
          element : <Saved />
        },
        {
          path : '/community',
          element : <Community />
        },
        {
          path : '/ai-ingredients',
          element : <CoolAIFull/>
        }
       
      ]
    }
  ])

  return (
    <div className='main'>
      <RouterProvider router = {browserRouter}/>
    </div>
  )
}

export default App
