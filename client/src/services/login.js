import axios from 'axios'
const baseRoute = '/api/login'

const loginUser = async(username, password) => {
  const loginDataObject = { username, password }
  const userData = await axios.post(baseRoute, loginDataObject)

  return userData
}

export { loginUser }