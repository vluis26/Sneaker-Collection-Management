import React from 'react'

const Header = ({ toggleModal, nbOfSneakers }) => {
  return (
    <header className='header'>
        <div className="container">
            <h3>Sneaker List ({nbOfSneakers})</h3>
            <button onClick={() => toggleModal(true)} className='btn'>Add New Sneaker</button>
        </div>
    </header>
  )
}

export default Header