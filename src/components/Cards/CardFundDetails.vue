<template>
	<pre>{{ fundDetailFilter(fundDetails.sedol) }}</pre>
</template>

<script>
import { mapGetters } from "vuex";

export default ({
	props: {
		fundTitle: {
			type: String,
			default: "",
		},
	},
	components: {
	},
	computed: {
		...mapGetters("hl", ["fundDetailFilter"])
	},
	data() {
		return {
		}
	},
	methods: {
  	},
	mounted() {
		this.$store.dispatch("hl/getFundDetails",{searchTitle:this.fundTitle});
	}
})

</script>