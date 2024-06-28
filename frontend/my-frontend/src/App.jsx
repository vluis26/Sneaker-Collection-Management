import { useEffect } from 'react'
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getSneakers } from './api/SneakerService'
import './App.css'
import Header from './components/Header'
import SneakerList from './components/SneakerList'

function App() {
  const [data, setData]= useState({})
  const [currentPage, setCurrentPage]= useState(0)

  const getAllSneakers = async (page = 0, size = 10) => {
    try{
      setCurrentPage(page)
      const { data } = await getSneakers(page, size)
      setData(data)
      console.log(data)
    } catch(error){
      console.log(error)
    }
  }

  const toggleModal = (show) => { console.log("I was clicked") }

  useEffect(() => {
    getAllSneakers();
  }, [])

  return (
    <>
    <Header toggleModal= {toggleModal} nbOfSneakers= {data.totalElements}/>
    <main className='main'>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Navigate to={'/sneakers'}/>}/>
          <Route path='/sneakers' element={<SneakerList data={data} currentPage={currentPage} getAllSneakers={getAllSneakers}/>}/>
        </Routes>
      </div>
    </main>
   
    </>
  )
}

export default App
