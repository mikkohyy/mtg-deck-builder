const createBearerToken = (token) => {
  const createdToken = `bearer ${token}`

  return createdToken
}

export { createBearerToken }