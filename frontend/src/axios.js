


import axios from "axios";


const instance = axios.create({
    baseURL:'https://ytdlbackend.herokuapp.com'
});

export default instance;