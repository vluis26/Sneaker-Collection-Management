import React from 'react';
import { Link } from 'react-router-dom';

const Sneaker = ({ sneaker }) => {
  return (
    <Link to={`/sneakers/${sneaker.id}`} className="contact__item">
      <div className="contact__header">
        <div className="contact__image">
          <img src={sneaker.photoUrl} alt={sneaker.name} />
          <div className="overlay"></div>
        </div>
        <div className="contact__details">
          <p className="contact_name">{sneaker.name} </p>
          <p className="contact_title">{sneaker.brand}</p>
        </div>
      </div>
      <div className="contact__body">
        <p>{sneaker.model}</p>
        <p>{sneaker.colorway}</p>
        <p>{sneaker.styleId}</p>
        <p>${sneaker.stockxprice}</p>
      </div>
    </Link>
  );
};

export default Sneaker;
