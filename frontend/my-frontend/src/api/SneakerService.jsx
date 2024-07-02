import axios from 'axios'

const API_URL = 'http://localhost:8080/sneakers';

export async function saveSneaker(sneaker){
    return await axios.post(API_URL, sneaker)
}

export async function getSneakers(page = 0, size = 10){
    return await axios.get(`${API_URL}?page=${page}&size=${size}`)
}

export async function getSneaker(id) {
    return await axios.get(`${API_URL}/${id}`);
}

export async function updateSneaker(sneaker){
    return await axios.post(API_URL, sneaker)
}

export async function udpatePhoto(formData) {
    return await axios.put(`${API_URL}/photo`, formData);
}

export async function deleteSneaker(id) {
    return await axios.delete(`${API_URL}/${id}`);
}
