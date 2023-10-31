import {useState, useEffect} from 'react'
import axios from 'axios'

const Weather = ({coord, countryName, filteredCountries}) => {

  const [weather, setWeather] = useState({});  
  const [loading, setLoading] = useState(false);

  const lat = coord[0];
  const long = coord[1];
  const api_key = process.env.REACT_APP_API_KEY;
  
  useEffect(() => {    
   
    if(filteredCountries) {
      let ignore = false;

      const baseUrl = `https://api.openweathermap.org/data/2.5/weather?&units=metric`
      setLoading(true);
        axios 
        .get(`${baseUrl}&lat=${lat}&lon=${long}&appid=${api_key}`)
        .then(res => { 
          if(!ignore) {           
            setWeather(res.data);
            setLoading(false);
          }             
        })
        .catch(err => console.log(err))  
        return () => {
          ignore = true;
        }
    }
      
  },[])

  if (weather.main) {
    return <>
      <h3>Weather in {countryName}</h3>
      <p>Temperature: {weather.main.temp}° celcius</p>
      <img alt={`${countryName} flag`} src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} style={{width: 150 + 'px'}}></img>
      <p>wind: {weather.wind.speed} m/s</p>
    </>
  }  
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
    return <CountryDetails filteredCountries={filteredCountries[0]}/>
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
      <Weather coord={latlng} countryName={name.common} filteredCountries = {filteredCountries} />     
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
        console.log('Fetching countries done!');
        setCountriesList(response.data);
      })
  };

  useEffect(fetchCountries, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  
  const handleFilteredCountries = () => {  
    if(search) {
      const result = countriesList.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
      setFilteredCountries(result);   
    }   
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
