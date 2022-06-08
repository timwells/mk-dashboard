<template>
	<div>
	  	<GoogleTrend id="google-trend1" keywords="[btc]" geo="US" search="2020-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend2" keywords="[recession]" geo="GB" search="2015-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend2" keywords="[bear market, bull market]" geo="US" search="2020-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend3" keywords="[BJSS]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend4" keywords="[IoT]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend5" keywords="[ML,AI]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend6" keywords="[blockchain]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend7" keywords="[supply chain]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend8" keywords="[uipath]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend9" keywords="[Sheffield Digital]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<GoogleTrend id="google-trend10" keywords="[Sheffield Digital Festival]" geo="GB" search="2008-01-01 2022-06-01"/>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
	},
	data() {
		return {
		}
	},
	mounted() {
	}
})

</script>

<style lang="scss">
</style>