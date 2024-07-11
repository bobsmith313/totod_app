import { Fragment } from 'react/jsx-runtime'
import { Route, Routes } from 'react-router-dom'
import { ToDosProvider } from './Modules/ToDosContext'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import HompePage from './Components/HomePage/HomePage'
import PageNotFound from './Components/PageNotFound/PageNotFound'
import ToDos from './Components/ToDos/ToDos'
import './App.css'

function App() {

  return (
    <Fragment>
      <ToDosProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HompePage />} />
          <Route path="todos/:id" element={<ToDos />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </ToDosProvider>
    </Fragment>
  )
}

export default App