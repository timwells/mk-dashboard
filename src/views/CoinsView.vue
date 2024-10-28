<template>
	<div>
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
		<a-tabs v-model="activeKey">
			<a-tab-pane v-for="(category,i) in categories.data" :key="i" :tab="category.name">
				<!--pre>{{ category}}</pre-->
				<!--pre>{{ gtProducts(category.category) }}</pre-->
				<pre>{{ products }}</pre>
			</a-tab-pane>
		</a-tabs>
		<pre>{{ products }}</pre>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default ({
	components: {
	},
	computed: {
		...mapState("gbcc", ["categories","productsRefreshProgress","productsRefreshComplete","products"]),
		...mapGetters("gbcc", ["gtProducts"]),
	},
	watch: {
		productsRefreshComplete(n,o) {
			if(n === true) {
				this.isDisabled = false
			}
		},
		categories(n,o) {
			for(let i=0; i < n.data.length; i++)
				this.$store.dispatch("gbcc/getProducts",{category: n.data[i].category});
		}
	},
	data() {
		return {
			activeKey: 0,
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