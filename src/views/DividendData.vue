<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">			
			<a-table ref="tt" v-if="dividendData"
				:columns="dividendColumns" 
				:data-source="dividendData" 
				:pagination="pagination"
				:rowKey="(record,index) => index"
				class='table table-small' style="margin: 0; background-color: white;">

				<template slot="epic" slot-scope="epic"><p class="m-0 font-regular text-muted">{{ epic }}</p></template>
				<template slot="name" slot-scope="name"><p class="m-0 font-regular text-muted">{{ name }}</p></template>
				<template slot="market" slot-scope="market"><p class="m-0 font-regular text-muted">{{ market }}</p></template>
				<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>				
				<template slot="dividend" slot-scope="dividend"><p class="m-0 font-regular text-muted">{{ dividend }}</p></template>				
				<template slot="exdividenddate" slot-scope="exdividenddate"><p class="m-0 font-regular text-muted">{{ exdividenddate }}</p></template>				

			</a-table>
		</a-col>
	</a-row>
</template>

<script>
//{"epic": "SMIN", "name": "Smiths Group", "market": "FTSE 100", "price": "1506p", "dividend": "27.3p", "exdividenddate": "20-Oct"},

const dividendColumns = 
[
	{ title: 'Epic', dataIndex: 'epic', scopedSlots: { customRender: 'epic' }},
	{ title: 'Name', dataIndex: 'name', scopedSlots: { customRender: 'name' }},
	{ title: 'Market', dataIndex: 'market', scopedSlots: { customRender: 'market' }},
	{ title: 'Price', dataIndex: 'price', scopedSlots: { customRender: 'price' }},
	{ title: 'Dividend', dataIndex: 'dividend',scopedSlots: { customRender: 'dividend' }},
	{ title: 'Ex-Div-Date', dataIndex: 'exdividenddate',scopedSlots: { customRender: 'exdividenddate' }}
];

import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["dividendData"])	
	},
	data() {
		return {
			dividendColumns,
			pagination: { 
				pageSize: 10, onChange: (p) => {
					for(let i=0; i < this.expandedIdList.length; i++) {
						var e = document.getElementById(this.expandedIdList[i]); 
						e.removeChild(e.children[0]);	
					}
					this.expandedIdList = []
				},
			},
			expandedIdList: [],
			expandedRowKeys: []
		}
	},
	methods: {
	},	
	mounted() {
		this.$store.dispatch("wscrape/getDividendData");
	}
})
</script>

<style lang="scss"></style>