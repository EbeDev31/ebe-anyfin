import React from 'react';
import './App.css';
import Currency from "./components/Currency"


const apiKeys = "4959c7d827d69aa8459f422b386f079f";
const exchangeRateUrl = `http://data.fixer.io/api/latest?access_key=${apiKeys}`
class App extends React.Component {
    constructor() {
        super()
        this.state = {

            swedishSek: {
                name: "Swedish krona",
                code: "SEK",
                symbol: "kr",
                rate: 10.739243,
            },
            sekValue: 10.739243,

            //Local currency :
            localCurrency: 0,
            localCurRate: 0,
            localValue: 0,

            //searchedCountry
            name: "",
            capital: "",
            population: "",
            currency: "",
            searchedCountry: "",
            country: "",

            // All Countries
            countries: [],

            //All Exchange rates compared to Euro
            exchangeRates: [],

        }
    }
    componentDidMount() {

        this.fetchCountries()
        this.fetchCurrencyRate()
    }

    //Function in charge of making api call for Exchange Rates
    fetchCurrencyRate = () => {

        fetch(exchangeRateUrl)
            .then(res => {
                return res.json()
            })
            .then(jSon => {
                let exchangeRates = jSon.rates
               
                this.setState({
                    exchangeRates: exchangeRates
                })
            })
    }

    //Function in charge of making api call for Countries
    fetchCountries = () => {

        fetch("https://restcountries.eu/rest/v2/all")
            .then(res => {
                return res.json()
            })
            .then(jSon => {
                let countries = jSon

                this.setState({
                    countries: countries
                })
            })
    }

    // Helper/Test Function for searchCountry(), 
    //this is the test a country should pass to be visualized
    countrySearchedFor = (country) => {

        const { searchedCountry } = this.state
        if (country.name.toLowerCase() === 
            searchedCountry.toLowerCase()) {
            return country
        }
        else if (country.alpha2Code.toLowerCase()
                 === searchedCountry.toLowerCase()) {
            return country
        }
        else if (country.alpha3Code.toLowerCase() === 
                 searchedCountry.toLowerCase()) {
            return country
        }
        else {
        }
    }

    //Input Handler for country search
    searchText = (countryName) => {
        this.setState({ searchedCountry: countryName.target.value })
    }

    changeAmount = (e, currencyType) => {

        const {swedishSek } = this.state
        //let calcExchRate=0

        if (currencyType === "A") {
            let amount = e.target.value
            let calcExchRate = (amount / swedishSek.rate)
            this.setState({
                sekValue: amount,
                localValue: calcExchRate
            })

        } else if (currencyType === "B") {
            let amount = e.target.value
            let calcExchRate = (amount * swedishSek.rate)
            this.setState({
                sekValue: calcExchRate,
                localValue: amount
            })

        }
    }

    //Function/Button for starting country search
    searchCountry = () => {

        //Check Input field content if its not empty
        const fieldContent = this.state.searchedCountry

        if (fieldContent.length !== 0) {
            this.setState({
                searched: false
            })
            const country = this.state.countries.find(this.countrySearchedFor)

            // check is this.countrySearchedFor provided a proper country
            if (!country) {
                alert("Please type a valid country")
                this.setState({
                    searchedCountry: " "
                })
            }
            else {
                const localCurrency = country.currencies[0]
                this.setState({
                    country: country,
                    localCurrency: localCurrency,
                    searchedCountry: "",
                    searched: true

                })
                this.getCurRate(localCurrency.code);
            }
        }
        else {
            //message in case empty search is done
            alert("please type in a country")
        }

        this.setState({
          searchedCountry:""
        })
    }

    //This is in charge of getting exchange rate of selected country 
    getCurRate = (currencyCode) => {

        const { exchangeRates } = this.state
        //turn obj into arr of arr
        let exchRateArr = Object.entries(exchangeRates)
        //filter through arrs
        let exchRate = exchRateArr.filter(exchRate => {
            return exchRate.indexOf(currencyCode) >= 0
        })

        let curRate = exchRate[0][1]
        console.log("Local cur Rate: ", exchRate[0][1])

        this.setState({
            localCurRate: curRate,
            localValue: curRate,
            sekValue: 10.739243
        })
    }

    render() {
        const { name, capital, population, } = this.state.country
        const { searched, swedishSek, sekValue, 
          localCurrency, localValue,searchedCountry } = this.state

        return (
            <div className="main">
              {/*****************SEARCH AREA */}
                <div className="search">
                    <input className="searchBox"
                        type="text" placeholder="Search for a Country"
                        value={searchedCountry}
                        onChange={this.searchText}>
                    </input>
                    <button className="searchButton"
                        onClick={this.searchCountry}
                    >
                        Search
                    </button>
                </div>
              {/*****************RESULTS AREA */}
                <div className="results">
                    <div className="country">
                        <div className="details">
                            <p>Name :</p>
                            <p>Capital :</p>
                            <p>Population :</p>
                            <p>Currency :</p>
                        </div>
                        <div className="value">
                            <p>{name}</p>
                            <p>{capital}</p>
                            <p>{population}</p>
                            <p>{localCurrency.name} </p>

                        </div>
                    </div>
              {/*****************CURRENCY EXCHANGE AREA */}
                    <p className="curExchTitle">
                      Amount of {localCurrency ? localCurrency.name : "$"}s 
                      in {swedishSek.name}</p>
                    <div className="currency">
                      <Currency swedishSek={swedishSek}
                       localValue={localValue} sekValue={sekValue}
                       localCurrency={localCurrency}
                       changeAmount={this.changeAmount}/>
                    </div>
                </div>

            </div>
        )
    }
}

export default App;
