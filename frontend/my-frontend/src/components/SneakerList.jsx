import React from 'react'
import Sneaker from './Sneaker'

const SneakerList = ({ data, currentPage, getAllSneakers }) => {
  return (
    <main className='main'>
        {data?.content?.length === 0 && <div>No Sneakers. Please add a new contact</div>}

        <ul className='contact__list'>
            {data?.content?.length > 0 && data.content.map(sneaker => <Sneaker sneaker={sneaker} key={sneaker.id} />)}
        </ul>

        {/* Pagination funtionality */}
        {data?.content?.length > 0 && data?.totalPages > 1 &&
            <div className='pagination'>
                <a onClick={() => getAllSneakers(currentPage - 1)} className={0 === currentPage ? 'disabled' : ''}>&laquo;</a>

                { data && [...Array(data.totalPages).keys()].map((page, index) => 
                    <a onClick={() => getAllSneakers(page)} className={currentPage === page ? 'active' : ''} key={page}>{page + 1}</a>)}


                <a onClick={() => getAllSneakers(currentPage + 1)} className={data.totalPages === currentPage + 1 ? 'disabled' : ''}>&raquo;</a>
            </div>            
        }


    </main>
  )
}

export default SneakerList