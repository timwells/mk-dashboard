<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<small><span>{{ gProducts(category).created }}</span> | <span>{{ gProducts(category).source }}</span></small>
		<a-table 
			:columns="COLUMNS" 
			:data-source="gProducts(category).data" 
			:pagination="false" 
			:rowKey="(record,i) => i"
			class='table table-small' style="margin: 6">
		</a-table>

	</a-card>
</template>

<script>
import { mapGetters } from "vuex";

const COLUMNS = [
	{
		title: 'Name',
		dataIndex: 'name',
		width: 180
	},
	{
		title: 'Price',
		dataIndex: 'price',
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.price - b.price,
		width: 80
	},
	{
		title: 'Scarcness',
		dataIndex: 'scarcness',
		width: 80
	},
	{
		title: 'Fineness',
		dataIndex: 'fineness',
		width: 80
	},
];
export default ({
	props: {
		category: {
			type: String,
			default: ""
		},
	},
	computed: {
		...mapGetters("gbcc", ["gProducts"]),
	},
	data() {
		return {
			COLUMNS
		}
	},
	mounted() {
		this.$store.dispatch("gbcc/getProducts",{category: this.category});
	}
})
</script>