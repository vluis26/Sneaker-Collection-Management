import { useEffect } from 'react'
import { useState } from 'react'
import { getSneakers } from './api/SneakerService'
import './App.css'

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

  useEffect(() => {
    getAllSneakers();
  }, [])

  return (
    <div>
      hello
    </div>
  )
}

export default App
