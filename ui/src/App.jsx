import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useEffect } from 'react'
import { NavLink } from 'react-router'

class apiCalls{

  constructor() {}
  static url = 'http://localhost:3000/';

  static async calculateFibo(number) {
    const reponse = await fetch(`${apiCalls.url}fibo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: number
      })
    })
  }

  static async fetchAllCache(){
    const response = await fetch(`${apiCalls.url}fiboCache`)
    return response;
  }

  static async fetchAllfibs(){
    const response = await fetch(`${apiCalls.url}fibo`)
    return response;
  }

}


const AllFibs = () => {
  const [fibs, setFibs] = useState([]);

  useEffect(() => {
    apiCalls.fetchAllfibs().then(async (res) => {
      const value = await res.json();
      setFibs(value.rows);
    });
  }, [])
  return <>
    <h3 style={{margin:0,padding:0}}>List of fibs </h3>
    <div className='list-row'>

      {fibs.map((v) => <p>{v.number}</p>)}
    </div>
  </>
}

const AllCache = () => {
  const [caches, setCaches] = useState([]);

  useEffect(() => {
    apiCalls.fetchAllCache().then(async (res) => {
      const value = await res.json();
      console.log(value);
      setCaches(value.rows);
    });
  }, []);


  return <>
    <h3 style={{ margin: 0, padding: 0 }}>List of caches </h3>
    <div className=''>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {Object.entries(caches).map(([key, value]) => (
            <tr key={key}>
              <td style={{ border: '1px dashed red' }}>{key}</td>
              <td style={{ border: '1px dashed red' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>

}


function App() {
  
  const onSubmit = (e) => {
    e.preventDefault();
    // console.log(e);
    apiCalls.calculateFibo(e.target.number.value);
  }
  return <>
  <NavLink to="/about" end> about</NavLink>
    <form className='form' onSubmit={onSubmit}>
      <label>
        Enter for a fibonacci
      </label>
      <input id='number' type='number' placeholder='enter a number'/>
      <input type='submit' value='calculate' />
    </form>
    <AllFibs/>
    <AllCache/>

  </>
}

export default App
