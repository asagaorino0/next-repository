import axios from 'axios'

export const getAPIData = async () => {
    const res = await axios.get('hpps://jsonplaceholder.typicode.com/users')
    const data = res.data
    JSON.stringify(data)
    return data
}