<template>
    <div>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="(indicator, index) in indicators" :key="index">
                <CardIndicatorInfo :title="indicator.title" :url="indicator.url" :type="indicator.type"/>
			</a-col>
		</a-row>

        <!--h3>VIX</h3>
        <iframe 
            src='https://d3fy651gv2fhd3.cloudfront.net/embed/?s=vixcls%3afred&lbl=0&v=202206200913V20220312&d1=20120622&h=300&w=1000' 
            height='300' width='100%'  frameborder='0' scrolling='no'></iframe>

        <h2>UK Housing Index</h2>
        <iframe 
            src='https://d3fy651gv2fhd3.cloudfront.net/embed/?s=unitedkinhouind&v=202206111009V20220312&d1=20120622&h=300&w=1000' 
            height='300' width='100%'  frameborder='0' scrolling='no'></iframe>
   
        <h2>UK Inflation</h2>
           <img src="https://www.statista.com/graphic/1/306720/cpi-rate-forecast-uk.jpg" 
            alt="Statistic: Annual inflation rate of the Consumer Price Index in the United Kingdom from 2000 to 2026" style="width: 100%; height: auto !important; max-width:1000px;-ms-interpolation-mode: bicubic;"/>

        <h3>UK CPI</h3>
        <img src="https://www.statista.com/graphic/1/281724/consumer-price-index-cpi-united-kingdom.jpg" alt="Statistic: Inflation rate for the Consumer Price Index (CPI) in the United Kingdom in April 2022, by sector | Statista" style="width: 100%; height: auto !important; max-width:1000px;-ms-interpolation-mode: bicubic;"/>

        <h2>UK Interest Rates</h2>
        <iframe 
            src='https://d3fy651gv2fhd3.cloudfront.net/embed/?s=ukbrbase&v=202206161123V20220312&d1=20120622&h=300&w=1000' 
            height='300' width='100%'  frameborder='0' scrolling='no'></iframe>

        <h2>UK Employment</h2>
        <iframe 
            src='https://d3fy651gv2fhd3.cloudfront.net/embed/?s=unitedkinfultimemp&v=202206140815V20220312&d1=20120622&h=300&w=1000' 
            height='300' width='100%'  frameborder='0' scrolling='no'></iframe>
            
        <h2>Fear & Greed</h2>
        <img src="https://alternative.me/crypto/fear-and-greed-index.png"-->
    </div>
</template>

<script>
const _indicators = [
    {
        title: "VIX",
        url:"https://d3fy651gv2fhd3.cloudfront.net/embed/?s=vixcls%3afred&lbl=0&v=202206200913V20220312&d1=20120622&h=300&w=1000",
        type:"iframe"
    },
    {
        title:"UK Interest Rates",
        url: 'https://d3fy651gv2fhd3.cloudfront.net/embed/?s=ukbrbase&v=202206161123V20220312&d1=20120622&h=300&w=1000',
        type: "iframe"
    },
    {
        title:"UK Employment",
        url: 'https://d3fy651gv2fhd3.cloudfront.net/embed/?s=unitedkinfultimemp&v=202206140815V20220312&d1=20120622&h=300&w=1000',
        type: "iframe"
    },
    {
        title: "UK Housing Index",
        url:"https://d3fy651gv2fhd3.cloudfront.net/embed/?s=unitedkinhouind&v=202206111009V20220312&d1=20120622&h=300&w=1000",
        type:"iframe"
    },
    {
        title:"UK Inflation",
        url: "https://www.statista.com/graphic/1/306720/cpi-rate-forecast-uk.jpg",
        type: "img"
    },
    {
        title: "UK CPI",
        url: "https://www.statista.com/graphic/1/281724/consumer-price-index-cpi-united-kingdom.jpg",
        type: "img"
    },
    {
        title:"Fear & Greed",
        url:"https://alternative.me/crypto/fear-and-greed-index.png",
        type:"img"
    }
]

import { mapState } from "vuex";
import CardIndicatorInfo from '@/components/Cards/CardIndicatorInfo';

export default ({
	components: {
        CardIndicatorInfo
	},
	computed: {
    	...mapState("indicators", ["indicators"])
	},
	data() {
		return {}
	},
	mounted() {
        this.$store.dispatch("indicators/getIndicators");
	}
})
</script>

<style>

</style>