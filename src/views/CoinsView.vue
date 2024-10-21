<template>
	<div>
		<pre>{{ categories }}</pre>
	</div>
</template>

<script>

import { mapState } from "vuex";
export default ({
	components: {
	},
	computed: {
		...mapState("gbcc", ["categories"]),
	},
	watch: {
    },
	data() {
		return {
		}
	},
	methods: {
	},	
	mounted() {
		this.$store.dispatch("gbcc/getCategories");
	}
})
</script>

<style lang="scss">
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 6px 6px;
}

li:hover{ color: blue}

li {
  list-style-type: none;
}
</style>