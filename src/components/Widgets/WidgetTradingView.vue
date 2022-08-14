<template>
    <div :id="idc" class="tradingview-widget-container">
      <div :id="id"></div>
  </div>
</template>

<script>
// https://www.tradingview.com/widget/advanced-chart/

const preFixContainerId = 'tvc_'
const preFixId = 'tvi_'

export default {
  props: {
    symbol: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: "500"
    },
    showToolbar: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    idc: '',
    id: ''
  }),
  methods: {},
  beforeMount () {
    let r = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.id = `${preFixId}_${r}`
    this.idc = `${preFixContainerId}_${r}`
    console.log("WidgetTradingView:beforeMount",this.id,this.idc)
  },
  beforeUnmount() {
    console.log("WidgetTradingView:beforeUnmount",this.id)
    // this.$root.$el.parentNode.removeChild(this.$root.$el)
  },
  mounted () {
    // https://uk.tradingview.com/widget/advanced-chart/
    const options = {
      'width': '100%',
      'height': this.height,
      'symbol': this.symbol,
      'interval': 'D',
      'timezone': 'Europe/London',
      'theme': 'light',
      'style': '8',
      'locale': 'en',
      'toolbar_bg': '#f1f3f6',
      'enable_publishing': false,
      'allow_symbol_change': false,
      'hide_side_toolbar': !this.showToolbar,
      'news': [ 'headlines' ],
      // https://stackoverflow.com/questions/65940103/how-to-override-the-studies-of-the-tradingview-widget
      'studies': [
        {
          id: "MASimple@tv-basicstudies",
          inputs: { length: 200 }
        },{
          id: "MASimple@tv-basicstudies",
          inputs: { length: 100 }
        },{
          id: "MASimple@tv-basicstudies",
          inputs: { length: 50 }
        },{
          id: 'StochasticRSI@tv-basicstudies',
        }
      ],
      'container_id': this.id
    }
    // eslint-disable-next-line no-new
    const TradingViewWidget = window.TradingView.widget
    // eslint-disable-next-line no-new
    new TradingViewWidget(options)
  }
}


/*
https://github.com/nirvanatikku/bittrex-enhanced/blob/master/settings.html

<option value='MARibbon@tv-basicstudies'>Accumulation/Distribution</option>
<option value='ACCD@tv-basicstudies'>Accumulation/Distribution</option>
<option value='studyADR@tv-basicstudies'>ADR</option>
<option value='AROON@tv-basicstudies'>Aroon</option>
<option value='ATR@tv-basicstudies'>Average True Range</option>
<option value='AwesomeOscillator@tv-basicstudies'>Awesome Oscillator</option>
<option value='BB@tv-basicstudies'>Bollinger Bands</option>
<option value='BollingerBandsR@tv-basicstudies'>Bollinger Bands %B</option>
<option value='BollingerBandsWidth@tv-basicstudies'>Bollinger Bands Width</option>
<option value='CMF@tv-basicstudies'>Chaikin Money Flow</option>
<option value='ChaikinOscillator@tv-basicstudies'>Chaikin Oscillator</option>
<option value='chandeMO@tv-basicstudies'>Chande Momentum Oscillator</option>
<option value='ChoppinessIndex@tv-basicstudies'>Choppiness Index</option>
<option value='CCI@tv-basicstudies'>Commodity Channel Index</option>
<option value='CRSI@tv-basicstudies'>ConnorsRSI</option>
<option value='CorrelationCoefficient@tv-basicstudies'>Correlation Coefficient</option>
<option value='DetrendedPriceOscillator@tv-basicstudies'>Detrended Price Oscillator</option>
<option value='DM@tv-basicstudies'>Directional Movement</option>
<option value='DONCH@tv-basicstudies'>Donchian Channels</option>
<option value='DoubleEMA@tv-basicstudies'>Double EMA</option>
<option value='EaseOfMovement@tv-basicstudies'>Ease Of Movement</option>
<option value='EFI@tv-basicstudies'>Elder's Force Index</option>
<option value='ElliottWave@tv-basicstudies'>Elliott Wave</option>
<option value='ENV@tv-basicstudies'>Envelope</option>
<option value='FisherTransform@tv-basicstudies'>Fisher Transform</option>
<option value='HV@tv-basicstudies'>Historical Volatility</option>
<option value='hullMA@tv-basicstudies'>Hull Moving Average</option>
<option value='IchimokuCloud@tv-basicstudies'>Ichimoku Cloud</option>
<option value='KLTNR@tv-basicstudies'>Keltner Channels</option>
<option value='KST@tv-basicstudies'>Know Sure Thing</option>
<option value='LinearRegression@tv-basicstudies'>Linear Regression</option>
<option value='MACD@tv-basicstudies'>MACD</option>
<option value='MOM@tv-basicstudies'>Momentum</option>
<option value='MF@tv-basicstudies'>Money Flow</option>
<option value='MoonPhases@tv-basicstudies'>Moon Phases</option>
<option value='MASimple@tv-basicstudies'>Moving Average</option>
<option value='MAExp@tv-basicstudies'>Moving Average Exponentional</option>
<option value='MAWeighted@tv-basicstudies'>Moving Average Weighted</option>
<option value='OBV@tv-basicstudies'>On Balance Volume</option>
<option value='PSAR@tv-basicstudies'>Parabolic SAR</option>
<option value='PivotPointsHighLow@tv-basicstudies'>Pivot Points High Low</option>
<option value='PivotPointsStandard@tv-basicstudies'>Pivot Points Standard</option>
<option value='PriceOsc@tv-basicstudies'>Price Oscillator</option>
<option value='PriceVolumeTrend@tv-basicstudies'>Price Volume Trend</option>
<option value='ROC@tv-basicstudies'>Rate Of Change</option>
<option value='RSI@tv-basicstudies'>Relative Strength Index</option>
<option value='VigorIndex@tv-basicstudies'>Relative Vigor Index</option>
<option value='VolatilityIndex@tv-basicstudies'>Relative Volatility Index</option>
<option value='SMIErgodicIndicator@tv-basicstudies'>SMI Ergodic Indicator</option>
<option value='SMIErgodicOscillator@tv-basicstudies'>SMI Ergodic Oscillator</option>
<option value='Stochastic@tv-basicstudies'>Stochastic</option>
<option value='StochasticRSI@tv-basicstudies'>Stochastic RSI</option>
<option value='TripleEMA@tv-basicstudies'>Triple EMA</option>
<option value='Trix@tv-basicstudies'>TRIX</option>
<option value='UltimateOsc@tv-basicstudies'>Ultimate Oscillator</option>
<option value='VSTOP@tv-basicstudies'>Volatility Stop</option>
<option value='Volume@tv-basicstudies'>Volume</option>
<option value='VWAP@tv-basicstudies'>VWAP</option>
<option value='MAVolumeWeighted@tv-basicstudies'>VWMA</option>
<option value='WilliamR@tv-basicstudies'>Williams %R</option>
<option value='WilliamsAlligator@tv-basicstudies'>Williams Alligator</option>
<option value='WilliamsFractal@tv-basicstudies'>Williams Fractal</option>
<option value='ZigZag@tv-basicstudies'>Zig Zag</option>
*/
</script>

<style>
</style>
