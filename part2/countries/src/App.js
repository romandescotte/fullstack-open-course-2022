import {useState, useEffect} from 'react'
import axios from 'axios'

const Weather = ({coord, countryName}) => {

  const lat = coord[0];
  const long = coord[1];
  const api_key = process.env.REACT_APP_API_KEY;
  const [weather, setWeather] = useState('');

  useEffect(() => {
    axios 
      .get(`https://api.openweathermap.org/data/2.5/weather?&units=metric&lat=${lat}&lon=${long}&appid=${api_key}`)
      .then(({data}) => { 
        // console.log(data);
        setWeather(data);
      })     
  },[])
  return <>
    <h3>Weather in {countryName}</h3>
    <p>temperature: {weather.main.temp}° celcius</p>
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} style={{width: 150 + 'px'}}></img>
    <p>wind: {weather.wind.speed} m/s</p>
    {console.log(weather)}
  </>

}

const SearchCountry = ({handleSearch, value}) => {
  return <>
    <form>
      <span>find countries <input onChange={handleSearch} value={value}></input></span>
    </form>
  </>
}

const Countries = ({filteredCountries, search}) => {  

  const [showDetails, setShowDetails] = useState();

  useEffect(() => {    
    setShowDetails(new Array(filteredCountries.length).fill(false));    
  }, [search]);

  const handleShowDetails = (position) => {    
    const updatedShowDetails = showDetails.map((item, index) => {
      if(index === position) {
        return !item; 
      }
      return item;    
    })  
    setShowDetails(updatedShowDetails);
  }

  if(filteredCountries.length === 1) {
    return <CountryDetails filteredCountries={filteredCountries[0]} />
  }
  if(filteredCountries.length <= 10) {    
    return filteredCountries.map((country, index) => <CountryList key={country.name.common} country={country.name.common} handleShowDetails={() => handleShowDetails(index)} position={index} showDetails={showDetails} filteredCountries={filteredCountries} />)     
  } else {
    return <p>Too many matches, specify another filter</p>
  }  
}

const CountryDetails = ({filteredCountries}) => {  

  const {name} = filteredCountries; 
  const {area} = filteredCountries;
  const {languages} = filteredCountries;
  const {flags} = filteredCountries;
  const {latlng} = filteredCountries;
  const {capital} = filteredCountries;
  
  
  return <>    
      <h2>{name.common}</h2>
      <p>Area code: {area}</p>
      <p>capital: {capital}</p>
      <h3>Languages</h3>
      <ul>
        {Object.keys(languages).map((key) => <li key={languages[key]}>{languages[key]}</li>)}
      </ul>
      <h3>Flag: </h3>
      <div><img style={{width: 150+'px'}} src={flags.png} alt={name.common + ' flag'}></img></div>    
      <Weather coord={latlng} countryName={name.common} />     
  </>
}

const CountryList = ({country, handleShowDetails, showDetails, position, filteredCountries}) => {
  return <> 
    <div>{country}
      <button onClick={handleShowDetails}>
        {
          showDetails[position] ? 'hide' : 'show'
        }
      </button>
        {
          showDetails[position] ? <CountryDetails filteredCountries={filteredCountries[position]} /> : ''       
        }      
    </div>
  </>
}

const App = () => {

  const [countriesList, setCountriesList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  
  const fetchCountries = () => {
    const url = 'https://restcountries.com/v3.1/all'
    axios 
      .get(url)
      .then(response => {     
        console.log('Fetching done!');
        setCountriesList(response.data);
      })
  };

  useEffect(fetchCountries, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  
  const handleFilteredCountries = () => {    
    const result = countriesList.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
    setFilteredCountries(result);   
  }    

  useEffect(handleFilteredCountries, [search]);

  return (
    <div>
      <SearchCountry handleSearch={handleSearch} value={search} />
      <Countries filteredCountries={filteredCountries} search={search} />        
    </div>
  );
}

export default App;
