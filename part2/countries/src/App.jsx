import {useState, useEffect} from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(responce =>{
        setAllCountries(responce.data)
      })
  }, [])

  const searchCountry = (event) => {
    setSearch(event.target.value)
  }

  const countriesToShow = search
    ? allCountries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <div>
      find countries <input value={search} onChange={searchCountry} />
      <Countries countries={countriesToShow} setSearch={setSearch}/>
    </div>
  )
}

export default App