<template>
	<a-row :gutter="24" type="flex" align="stretch">
		<a-col class="mb-8" :span="12" :xl="12">
			<a-card>
				<div class="card-content">
					<img :src="url2" alt="Performance Chart" height="300" width="100%">
				</div>
			</a-card>
		</a-col>
		<a-col class="mb-8" :span="12" :xl="12">
			<a-card>
				<div class="card-content">
					<a-table 
						:columns="hCols"
						:data-source="holdings"
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
		</a-col>
	</a-row>
</template>

<script>
/*<iframe 
	:src="url"
	:title="title" 
	width="100%" 
	height="1380" 
	style="border:none;">
</iframe>*/

const hCols = [
	{
		title: 'Security',
		dataIndex: 'security',
		//width: 140, 
		scopedSlots: { customRender: 'security' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

// "performance":[{"period":"26/02/19 to 26/02/20","retn":"4.66%"},
const pCols = [
	{
		title: 'Period',
		dataIndex: 'period',
		scopedSlots: { customRender: 'period' }
	},{
		title: 'Return',
		dataIndex: 'retn',
		width: 140, 
		scopedSlots: { customRender: 'retn' }
	}
]


export default ({
	props: {
		title: {
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
		perfomance: {type: Array},
		holdings: {type: Array}
	},
	data() {
		return {
			url2: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citicode}&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
			hCols,
			pCols,
			pagination: false
		}
	},
	methods: {}		
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

data() {
	return {
		openTrades: [],
		allTrades: [],
		loading: true,
		OpenTradeCols,
		colDictionary,
		pagination: { 
			pageSize: 200, onChange: (p) => {
				/*
				for(let i=0; i < this.expandedIdList.length; i++) {
					var e = document.getElementById(this.expandedIdList[i]); 
					console.log(this.expandedIdList[i],e);
					e.removeChild(e.children[0]);	
				}
				this.expandedIdList = []
				*/
			},
		},
		expandedIdList: [],
		expandedRowKeys: []
	}
},