import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getSneaker } from '../api/SneakerService';

const SneakerDetail = ({ updateSneaker, updateImage, deleteSneaker1 }) => {
    const inputRef = useRef();
    const [sneaker, setSneaker] = useState({
        id: '',
        name: '',
        brand: '',
        model: '',
        colorway: '',
        styleId: '',
        photoUrl: '',
        stockxprice: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchSneaker = async (id) => {
        try {
            const { data } = await getSneaker(id);
            setSneaker(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const updatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setSneaker((prev) => ({
                ...prev,
                photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`
            }));
            console.log('data');
        } catch (error) {
            console.log(error);
        }
    };

    const onChange = (event) => {
        setSneaker({ ...sneaker, [event.target.name]: event.target.value });
    };

    const onDeleteSneaker = async () => {
        try {
            await deleteSneaker1(id);
            navigate('/sneakers')
          } catch (error) {
            console.log(error);
          }
      };

    const onUpdateSneaker = async (event) => {
        event.preventDefault();
        await updateSneaker(sneaker);
        fetchSneaker(id);
        navigate('/sneakers')
    };

    useEffect(() => {
        fetchSneaker(id);
    }, [id]);

    return (
        <>
            <Link to={'/'} className='btn'>Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={sneaker.photoUrl} alt={`Profile photo of ${sneaker.name}`} />
                    <div className='profile__metadata'>
                        <p className='profile__name'>{sneaker.name}</p>
                        <p className='profile__muted'>JPEG or PNG</p>
                        <button onClick={selectImage} className='btn'>Change Photo</button>
                    </div>
                </div>
                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateSneaker} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={sneaker.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={sneaker.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Brand</span>
                                    <input type="text" value={sneaker.brand} onChange={onChange} name="brand" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Model</span>
                                    <input type="text" value={sneaker.model} onChange={onChange} name="model" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Colorway</span>
                                    <input type="text" value={sneaker.colorway} onChange={onChange} name="colorway" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">StyleId</span>
                                    <input type="text" value={sneaker.styleId} onChange={onChange} name="styleId" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">StockX Price</span>
                                    <input type="text" value={sneaker.stockxprice} name="stockxprice" readOnly />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                                <button type='button' className='btn btn-danger' onClick={onDeleteSneaker}>Delete</button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>

            <form style={{ display: 'none' }}>
                <input type='file' ref={inputRef} onChange={(event) => updatePhoto(event.target.files[0])} name='file' accept='image/*' />
            </form>
        </>
    );
};

export default SneakerDetail;
