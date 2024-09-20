<template>
	<div>
		<p>CardTVStockChart2</p>
		<CardTVStockChart2 epic="PRU"/>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CardTVStockChart2 from '@/components/Cards/CardTVStockChart2';

export default ({
	components: {
		CardTVStockChart2
	},
	computed: {
        //...mapState("pensions",["portfolios"])
	},
	data() {
		return {
		}
	},
	methods: {
	},
	async mounted() {
	}
})

</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>