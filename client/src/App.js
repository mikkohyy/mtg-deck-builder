import axios from 'axios'
import { useState } from 'react'
import Component from './components/Component'

const App = () => {
  const [ testThings, setTestThings ] = useState([])

  const fetchFromDb = async () => {
    try {
      const response = await axios.get('/api/tester')
      setTestThings(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <div>
      <p>Hello world!</p>
      <Component text={'hello'}/>
      <button onClick={fetchFromDb}>Press me</button>
      {testThings.map(testThing =>
        <div key={testThing.user_id}>{testThing.user_id} - {testThing.username}</div>)
      }
    </div>
  )
}

export default App
