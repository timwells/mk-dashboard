<template>
  <div>
    <p>PB</p>
    <pre>{{ premiumBondsData }} </pre>  
  </div>
</template>

<script>
import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["premiumBondsData"])
	},
	data() {
		return {}
	},
	mounted() {
        this.$store.dispatch("wscrape/getPremiumBondsData",{holder: "47199237Q"});
	}
})

</script>

<style>

</style>