<template>
	<div>
        <p> Pension View</p>
        <pre>{{ portfolios }}</pre>
</div>
</template>

<script>
// import CardTVStockChart2 from '@/components/Cards/CardTVStockChart2';

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		// CardTVStockChart2
	},
	computed: {
        ...mapState("pensions",["portfolios"])
	},
	data() {
		return {
		}
	},
	methods: {
	},
	async mounted() {
        this.$store.dispatch("pensions/getPortfolios")
	}
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>