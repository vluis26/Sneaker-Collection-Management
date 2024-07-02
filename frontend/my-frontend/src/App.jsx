import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { getSneakers, saveSneaker, udpatePhoto, deleteSneaker } from './api/SneakerService'
import './App.css'
import Header from './components/Header'
import SneakerDetail from './components/SneakerDetail'
import SneakerList from './components/SneakerList'

function App() {
  const navigate = useNavigate()
  const modalRef = useRef()
  const fileRef = useRef()
  const [data, setData]= useState({})
  const [currentPage, setCurrentPage]= useState(0)
  const [file, setFile] = useState(undefined)
  const [values, setValues] = useState({
    name: '',
    brand: '',
    model: '',
    colorway: ''
  })

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

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const handleNewSneaker = async (event) => {
    event.preventDefault()
    try{
      const {data} = await saveSneaker(values);
      const formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('id', data.id)
      const { data: photoUrl } = await udpatePhoto(formData)
      toggleModal(false)
      setFile(undefined)
      fileRef.current.value = null
      setValues({
        name: '',
        brand: '',
        model: '',
        colorway: ''
      })
      getAllSneakers()
      navigate('/')
    } catch(error){
      console.log(error)
    }
  }

  const updateSneaker = async (sneaker) => {
    try{
      const { data } = await saveSneaker(sneaker)
      console.log(data)
      getAllSneakers(currentPage)
    } catch(error){
      console.log(error)
    }
  }

  const updateImage = async (formData) => {
    try{
      const { data: photoUrl } = await udpatePhoto(formData)
    } catch(error){
      console.log(error)
    }
  }

  const deleteSneaker1 = async (id) => {
    try{
      const { data } = await deleteSneaker(id)
      getAllSneakers(currentPage)
      console.log(data)
    } catch(error){
      console.log(error)
    }
  }

  const toggleModal = show => show ? modalRef.current.showModal() : modalRef.current.close();

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
          <Route path='/sneakers/:id' element={<SneakerDetail updateSneaker = {updateSneaker} updateImage = {updateImage} deleteSneaker1 = {deleteSneaker1}/>}/>
        </Routes>
      </div>
    </main>


    {/* Modal */}
    <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Sneaker</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewSneaker}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onChange} name='name' required />
              </div>
              <div className="input-box">
                <span className="details">Brand</span>
                <input type="text" value={values.brand} onChange={onChange} name='brand' required />
              </div>
              <div className="input-box">
                <span className="details">Model</span>
                <input type="text" value={values.model} onChange={onChange} name='model' required />
              </div>
              <div className="input-box">
                <span className="details">Colorway</span>
                <input type="text" value={values.colorway} onChange={onChange} name='colorway' required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
   
    </>
  )
}

export default App
