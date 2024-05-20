<template>
	<div>
		<a-row :gutter="24" type="flex" align="stretch">
			<!--iframe src="https://www.multpl.com/" width="100%" height="1200" frameBorder="0"></iframe-->
			<pre>{{ mtplData }}</pre>
		</a-row>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["mtplData"]),
	},
	data() {
		return {}
	},
	mounted() {
		this.$store.dispatch("wscrape/getMtplData",{ds:"shiller-pe/table/by-month"});
	},
})

</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>