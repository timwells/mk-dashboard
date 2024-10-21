<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Coins">
			<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">
				<a-row :gutter="24" type="flex">
					<a-col :span="4">
					</a-col>
					<a-col :span="4">
					</a-col>
					<a-col :span="4">
					</a-col>
					<a-col :span="4">
						<a-button @click="refreshProducts()" :disabled="isDisabled">Refresh Products</a-button>
					</a-col>
					<a-col :span="8">
						<a-progress type="circle" :percent="productsRefreshProgress" :width="60" />
					</a-col>
				</a-row>
			</a-card>
		</a-tab-pane>
		<a-tab-pane key="2" tab="?">
		</a-tab-pane>
	</a-tabs>
</template>

<script>

import { mapState } from "vuex";
export default ({
	components: {
	},
	computed: {
		...mapState("gbcc", ["categories","productsRefreshProgress","productsRefreshComplete"]),	
	},
	watch: {
	productsRefreshComplete(n,o) {
		if(n === true) {
			this.isDisabled = false
		}
	},
	},
	data() {
		return {
			isDisabled: false,
		}
	},
	methods: {
		refreshProducts() {
			this.isDisabled = true
			this.$store.dispatch("gbcc/refreshProducts")
		}
	},	
	mounted() {
		// this.$store.dispatch("gbcc/getCategories");
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