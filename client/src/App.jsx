import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from './components/home/Home'
import Recipes from './components/recipes/Recipes'
import Recipe from './components/recipe/Recipe'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Saved from './components/saved/Saved'
import RoutingError from './components/RoutingError'
import CoolAIFull from './components/ai-ingredients/CoolAIFull'
import AccessDenied from './components/protected/AccessDenied'
import Print from './components/print/Print'


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
          path : '/recipe/:title',
          element : <Recipe/>
        },
        {
          path:'/recipes/category/:category',
          element: <Recipes/>
        },
        {
          path : '/saved',
          element : <Saved />
        },
        {
          path : '/ai-ingredients',
          element : <CoolAIFull/>
        },
        {
          path : '/print',
          element: <Print/>
        }
      ],
    },
    {
      path : '/access-denied',
      element : <AccessDenied/>
    }
  ])

  return (
    <div className='main'>
      <RouterProvider router = {browserRouter}/>
    </div>
  )
}

export default App
