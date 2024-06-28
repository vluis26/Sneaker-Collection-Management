import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSneaker } from '../api/SneakerService'

const SneakerDetail = ({ updateSneaker, updateImage }) => {

    const [sneaker, setSneaker] = useState({
        name: '',
        brand: '',
        model: '',
        colorway: '',
        photoUrl: ''
      })

      const { id } = useParams()

      const fetchSneaker = async (id) => {
        try{
          const {data} = await getSneaker(id);
          setSneaker(data)
          console.log(data)
        } catch(error){
          console.log(error)
        }
    }

    useEffect(() => {
        fetchSneaker(id);
    }, [])

  return (
    <>
        <Link to={'/'} className='link'> Back to list </Link>
        <div className='profile'>
            <div className='profile__details'>
                <img src={sneaker.photoUrl} alt={`Profile photo of ${sneaker.name}`} />
                <div className='profile__metadata'>
                    <p className='profile__name'>{sneaker.name}</p>
                    <p className='profile__muted'>JPEG or PNG</p>
                    <button className='btn'> Change Photo</button>
                </div>
            </div>
            <div className='profile__settings'>Settings will go here</div>
        </div>
    
    </>
  )
}

export default SneakerDetail