const Countries = ({countries, setSearch}) => {
    if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital</p>
                <p>Area {country.area}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages).map(language => 
                        <li key={language}>{language}</li>
                    )}
                </ul>
                <img src={country.flag.png} alt={`${country.name.common}'s flag`} />
            </div>
        )
    } else if (countries.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    } else {
        return(
            <ul>
                {countries.map(country => (
                    <li key={country.name.common}>
                        {country.name.common}
                        <button onClick={() => setSearch(country.name.common)}>show</button>
                    </li>
                ))}
            </ul>
        )
    }
}

export default Countries