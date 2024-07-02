<template>
	<div>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :xl="24">
				<a-tabs default-active-key="0">
					<a-tab-pane key="0" tab="Chart">
						<div v-if="details(sedol) !=null" class="card-content" >
							<h5><a :href="details(sedol).href" target="_blank">{{details(sedol).name }}</a></h5>
							<div>
								<span class="price-divide">Bid:{{details(sedol).bidPrice}}</span>
								<span class="price-divide">Ask:{{details(sedol).askPrice}}</span>
								<span class="price-divide"><img :src="details(sedol).changeArrow"/></span>
								<span class="price-divide">{{details(sedol).changeAmount}}</span>
								<span class="price-divide">Type:{{details(sedol).type }}</span>
								<span class="price-divide">netIC:{{details(sedol).netIC}}%</span>							
								<span class="price-divide">netAC:{{details(sedol).netAC}}%</span>
							</div>
							<img :src="chart" height="300" width="100%">
						</div>
					</a-tab-pane>
					<a-tab-pane key="1" tab="Holdings">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Weights Table -->
								<a-table 
									:columns="hCols"
									:data-source="details(sedol).holdings"
									:pagination="false"
									:rowKey="(record,i) => i"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
					<a-tab-pane key="2" tab="Performance">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Returns Table -->
								<a-table 
									:columns="PERIOD_Columns"
									:data-source="details(sedol).performance"
									:pagination="false"
									:rowKey="(record,i) => i"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
					<a-tab-pane key="3" tab="Sectors">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Weights Table -->
								<a-table 
									:columns="SECTOR_Columns"
									:data-source="details(sedol).sectors"
									:pagination="pagination"
									:rowKey="(record,i) => i"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
					<a-tab-pane key="4" tab="Countries">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Weights Table -->
								<a-table 
									:columns="COUNTRY_Columns"
									:data-source="details(sedol).countries"
									:pagination="false"
									:rowKey="(record,i) => i"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import { 
	HOLDING_Columns, 
	PERIOD_Columns, 
	SECTOR_Columns, 
	COUNTRY_Columns } from '@/common/table'


const hCols = [{
		title: 'Security',
		dataIndex: 'security',
		width: 130, 
		scopedSlots: { customRender: 'security' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

//console.log(HOLDING_Columns)



export default ({
	props: {
		title:       { type: String, default: "" },
		fund:        { type: String, default: "" },
		sedol:       { type: String, default: "" },
		citicode:    { type: String, default: ""},
	},
	computed: {
    	...mapState("funds", ["fundDetails"]),
		...mapGetters("funds",["gfundDetail"]),
	},
	watch: {
		fundDetails(o,n) {
			// console.log(o,n)
		}
	},
	data() {
		return {
			chart: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citicode}&color=f65d1a&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
			hCols,
			//pCols,
			//sCols,
			//cCols,
			pagination: false.
			HOLDING_Columns, 
			PERIOD_Columns, 
			SECTOR_Columns, 
			COUNTRY_Columns
		}
	},
	methods: {
		details(key) {
			return this.gfundDetail(key)
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFundDetail",{fund: this.fund });
	}
})
</script>

<style lang="scss">
.ant-card-body {
	.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    	padding: 6px 6px;
	}
}

.change-divide .change {
    font-size: 1.3em;
    margin-right: 0.1em;
    font-weight: bold;
}

.price-divide {
    font-size: 1.3em;
    font-weight: bold;
    margin-right: 0.4em;
    padding-right: 0.4em;
    border-right: 0.13em solid #1e1d56;
}
</style>
