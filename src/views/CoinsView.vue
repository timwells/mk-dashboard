<template>
	<div>
		<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">
			<!--a-row :gutter="24" type="flex">
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
			</a-row-->
			<a-tabs v-model="activeKey">
				<a-tab-pane v-for="(cat,i) in categories.data" :key="i" :tab="cat.name">
					<CardCoinTable :category="cat.category"></CardCoinTable>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { mapState } from "vuex";
import CardCoinTable from '@/components/Cards/CardCoinTable';

export default ({
	components: {
		CardCoinTable
	},
	computed: {
		...mapState("gbcc", ["categories","productsRefreshProgress","productsRefreshComplete",]),
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