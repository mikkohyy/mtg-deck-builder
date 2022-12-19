import axios from 'axios'
const baseRoute = '/api/users'

const createUser = async(username, password) => {
  const newUserDataObject = { username, password }
  const returnedUserData = await axios.post(baseRoute, newUserDataObject)

  return returnedUserData
}

export { createUser }