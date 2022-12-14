import axios from 'axios'

const API_URL = 'https://phics.uncw3b.com/api/users/'

//register user

const register = async (userData) => {
    const response = await axios.post(API_URL, userData)

    if (response.data.error) {

        return response.data.error
    } else {
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
    }
}

//login user

const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)
    if (response.data.error) {

        return response.data.error
    } else {
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
    }


}

//logout user

const logout = () => {
    localStorage.removeItem('user')
}


const authService = {
    register,
    logout,
    login
}

export default authService