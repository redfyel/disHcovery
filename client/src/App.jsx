import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from './components/home/Home'
import Recipes from './components/recipes/Recipes'
import Auth from './components/auth/Auth'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import RoutingError from './components/RoutingError'
import './App.css'


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
        {
          path : '/join-us',
          element : <Auth/>,
          children : [
            {
              path : '/login',
              element : <Login />
            },
            {
              path : '/register',
              element : <Register />
            },    
          ]
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
