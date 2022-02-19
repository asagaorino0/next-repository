import axios from 'axios'

export const getQIITAData = async () => {
    const res = await axios.get('https://qiita.com/api/v2/items')
    const data = res.data
    JSON.stringify(data)
    return data
}