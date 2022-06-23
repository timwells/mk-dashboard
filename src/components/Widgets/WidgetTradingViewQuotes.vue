<template>
  <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget">
        <iframe 
            scrolling="no" 
            allowtransparency="true" 
            frameborder="0" 
            :src="url3"
            style="box-sizing: border-box; height: calc(418px); width: 100%;">
        </iframe>

            <!--iframe 
                :src="url"
                width="100%" 
                height="800" 
                style="border:none;">
            </iframe-->
        </div>
  </div>  
</template>

<script>

const quotes = {
  "locale": "en",
  "showSymbolLogo": true,
  "symbolsGroups": [
    {
      "name": "Financial",
      "symbols": [
        {
          "name": "NYSE:JPM",
          "displayName": "Jpmorgan Chase & Co"
        },
      ]
    },
    {
      "name": "Technology",
      "symbols": [
        {
          "name": "NASDAQ:AAPL",
          "displayName": "Apple"
        },
      ]
    },
    {
      "name": "Services",
      "symbols": [
        {
          "name": "NASDAQ:AMZN",
          "displayName": "Amazon Com Inc"
        },
      ]
    }
  ],
  "colorTheme": "light"
}

const host = 'https://s.tradingview.com/embed-widget/market-quotes/?'
const locale = 'locale=en#'
const s1 = `{"width":770%2C%22height%22%3A450%2C%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Indices%22%2C%22originalName%22%3A%22Indices%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22displayName%22%3A%22S%26P%20500%22%7D%2C%7B%22name%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22displayName%22%3A%22US%20100%22%7D%2C%7B%22name%22%3A%22FOREXCOM%3ADJI%22%2C%22displayName%22%3A%22Dow%2030%22%7D%2C%7B%22name%22%3A%22FOREXCOM%3AUKXGBP%22%2C%22displayName%22%3A%22UK%20100%22%7D%5D%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22market-quotes%22%7D`

const table = `{"width":770,"height":450,"symbolsGroups":[{"name":"Indices","originalName":"Indices","symbols":[{"name":"FOREXCOM:UKXGBP","displayName":"UK 100"}]}],"showSymbolLogo":true,"colorTheme":"light","isTransparent":false,"locale":"en"}`



/*
<iframe scrolling="no" allowtransparency="true" frameborder="0" src="https://s.tradingview.com/embed-widget/market-quotes/?%7B%22width%22%3A770%2C%22height%22%3A450%2C%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Indices%22%2C%22originalName%22%3A%22Indices%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22FOREXCOM%3AUKXGBP%22%2C%22displayName%22%3A%22UK%20100%22%7D%5D%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%7D" style="box-sizing: border-box; height: calc(418px); width: 100%;"></iframe>
*/

/*
<iframe scrolling="no" allowtransparency="true" frameborder="0" src="https://s.tradingview.com/embed-widget/market-quotes/?

"{"width"%3A770%2C%22height%22%3A450%2C%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Indices%22%2C%22originalName%22%3A%22Indices%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22FOREXCOM%3AUKXGBP%22%2C%22displayName%22%3A%22UK%20100%22%7D%5D%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%7D" style="box-sizing: border-box; height: calc(418px); width: 100%;"></iframe>
*/


export default ({
    props: {
        stock: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            url: `https://s.tradingview.com/embed-widget/market-quotes/?${encodeURIComponent(quotes)}`,
            url2: "https://s.tradingview.com/embed-widget/market-quotes/?locale=en#%7B%22width%22%3A770%2C%22height%22%3A450%2C%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Indices%22%2C%22originalName%22%3A%22Indices%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22displayName%22%3A%22S%26P%20500%22%7D%2C%7B%22name%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22displayName%22%3A%22US%20100%22%7D%2C%7B%22name%22%3A%22FOREXCOM%3ADJI%22%2C%22displayName%22%3A%22Dow%2030%22%7D%2C%7B%22name%22%3A%22FOREXCOM%3AUKXGBP%22%2C%22displayName%22%3A%22UK%20100%22%7D%5D%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22market-quotes%22%7D",

            url3:`${host}${encodeURIComponent(table)}`
        }
    },
    beforeMount() {
    },
    mounted() {
    }
})


/*

*/
</script>

<style>
</style>

