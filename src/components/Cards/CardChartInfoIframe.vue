<template>
	<div>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :xl="24">
				<a-card>
					<div class="card-content">
						<!-- Performance Chart -->
						<img :src="url2" alt="Performance Chart" height="300" width="100%">
					</div>
				</a-card>
			</a-col>
		</a-row>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-tabs default-active-key="1">
				<a-tab-pane key="1" tab="Summary">
					<a-card v-if="fundDetails">
						<div class="card-content">
							<a :href="fundDetails.href">{{fundDetails.name }}</a>
							<p>Type: {{fundDetails.type }}</p>
							<p>Bid: {{fundDetails.bidPrice }}</p>
							<p>Ask: {{fundDetails.askPrice }}</p>
							<p>netIC: {{fundDetails.netIC }}</p>
							<p>netAC: {{fundDetails.netAC }}</p>
						</div>
					</a-card>
				</a-tab-pane>	 
				<a-tab-pane key="2" tab="Holdings">
					<a-card v-if="fundDetails">
						<div class="card-content">
							<!-- Weights Table -->
							<a-table 
								:columns="hCols"
								:data-source="fundDetails.holdings"
								:pagination="pagination"
								class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								<template slot="security" slot-scope="security">
									<p class="m-0 font-regular text-muted">{{ security }}</p>
								</template>

								<template slot="weight" slot-scope="weight">
									<p class="m-0 font-regular text-muted">{{ weight }}</p>
								</template>
							</a-table>
						</div>
					</a-card>
				</a-tab-pane>
				<a-tab-pane key="3" tab="Performance">
					<a-card v-if="fundDetails">
						<div class="card-content">
							<!-- Returns Table -->
							<a-table 
								:columns="pCols"
								:data-source="fundDetails.performance"
								:pagination="pagination"
								class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								<template slot="period" slot-scope="period">
									<p class="m-0 font-regular text-muted">{{ period }}</p>
								</template>

								<template slot="retn" slot-scope="retn">
									<p class="m-0 font-regular text-muted">{{ retn }}</p>
								</template>
							</a-table>
						</div>
					</a-card>
				</a-tab-pane>
				<a-tab-pane key="4" tab="Sectors">
					<a-card v-if="fundDetails">
						<div class="card-content">
							<!-- Weights Table -->
							<a-table 
								:columns="sCols"
								:data-source="fundDetails.sectors"
								:pagination="pagination"
								class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								<template slot="security" slot-scope="sector">
									<p class="m-0 font-regular text-muted">{{ sector }}</p>
								</template>

								<template slot="weight" slot-scope="weight">
									<p class="m-0 font-regular text-muted">{{ weight }}</p>
								</template>
							</a-table>
						</div>
					</a-card>
				</a-tab-pane>
				<a-tab-pane key="5" tab="Countries">
					<a-card v-if="fundDetails">
						<div class="card-content">
							<!-- Weights Table -->
							<a-table 
								:columns="cCols"
								:data-source="fundDetails.countries"
								:pagination="pagination"
								class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
								<template slot="security" slot-scope="country">
									<p class="m-0 font-regular text-muted">{{ country }}</p>
								</template>

								<template slot="weight" slot-scope="weight">
									<p class="m-0 font-regular text-muted">{{ weight }}</p>
								</template>
							</a-table>
						</div>
					</a-card>
				</a-tab-pane>
			</a-tabs>
		</a-row>
	</div>
</template>

<script>
/*<iframe 
	:src="url"
	:title="title" 
	width="100%" 
	height="1380" 
	style="border:none;">
</iframe>*/
import { mapState } from "vuex";

const hCols = [{
		title: 'Security',
		dataIndex: 'security',
		width: 140, 
		scopedSlots: { customRender: 'security' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

// "performance":[{"period":"26/02/19 to 26/02/20","retn":"4.66%"},
const pCols = [{
		title: 'Period',
		dataIndex: 'period',
		width: 140, 
		scopedSlots: { customRender: 'period' }
	},{
		title: 'Return',
		dataIndex: 'retn',
		width: 80, 
		scopedSlots: { customRender: 'retn' }
	}
]

const sCols = [{
		title: 'Sector',
		dataIndex: 'sector',
		width: 140, 
		scopedSlots: { customRender: 'sector' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

const cCols = [{
		title: 'Country',
		dataIndex: 'country',
		width: 140, 
		scopedSlots: { customRender: 'country' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

export default ({
	props: {
		title: {
			type: String,
			default: "",
		},
		fund: {
			type: String,
			default: "",
		},
		sedol: {
			type: String,
			default: "",
		},
		citicode: {
			type: String,
			default: "",
		},
		holdings: {type: Array},
		performance: {type: Array}
	},
	computed: {
    	...mapState("wscrape", ["fundDetails"]),
	},
	data() {
		return {
			url2: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citicode}&color=f65d1a&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
			hCols,
			pCols,
			sCols,
			cCols,
			pagination: false
		}
	},
	methods: {},
	mounted() {
		this.$store.dispatch("wscrape/getFundDetail",{fund: this.fund });
		//this.$store.dispatch("wscrape/getDataromaHoldings",{ q: this.detail });
	}
})

// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=FKSFU&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_

/*
	data() {
		return {
			url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartingTool.aspx?code=${this.sedol}&CodeType=SEDOL&InstrType=F`,
			url2: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citicode}&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
			holdingsCols
			// pagination: { pageSize: 20 }
		},
	},

*/
</script>

<style lang="scss">
.ant-card-body {
	.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    	padding: 6px 6px;
	}
}
</style>
