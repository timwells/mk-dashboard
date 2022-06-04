<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<a-row type="flex" align="middle">
				<a-col :span="24" :md="12">
					<h5 class="font-semibold m-0">Funds Table</h5>
				</a-col>
			</a-row>
		</template>

		<a-table 
			:columns="columns" 
			:data-source="data" 
			:pagination="pagination" 
			:row-selection="rowSelection"
			:rowKey="record => record.key"
			class='table table-small'>
			<a-button
				icon="plus"
				type="primary"
				slot="action"
				slot-scope="record"
				@click="onExpand(record.key)">
			</a-button>
			<div slot="expandedRowRender" slot-scope="record" style="margin: 0">
				<CardChartInfoIframe :title="record.name" :sedol="record.sedol"></CardChartInfoIframe>
			</div>

			<template slot="name" slot-scope="name">
				<p class="m-0 font-regular text-muted">{{ name }}</p>
			</template>
			<template slot="type" slot-scope="type">
				<p class="m-0 font-regular text-muted">{{ type }}</p>
			</template>
			<template slot="sedol" slot-scope="sedol">
				<p class="m-0 font-regular text-muted">{{ sedol }}</p>
			</template>
			<template slot="bidPrice" slot-scope="bidPrice">
				<p class="m-0 font-regular text-muted">{{ bidPrice }}</p>
			</template>
			<template slot="askPrice" slot-scope="askPrice">
				<p class="m-0 font-regular text-muted">{{ askPrice }}</p>
			</template>
			<template slot="netIC" slot-scope="netIC">
				<p class="m-0 font-regular text-muted">{{ netIC }}</p>
			</template>
			<template slot="netIA" slot-scope="netIA">
				<p class="m-0 font-regular text-muted">{{ netIA }}</p>
			</template>
		</a-table>
	</a-card>
</template>

<script>
import CardChartInfo from '@/components/Cards/CardChartInfo';
import CardChartInfoIframe from '@/components/Cards/CardChartInfoIframe';

// sedol: B8HTXL7
// chart: FGWTB
// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=FGWTB&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_

// https://webfund6.financialexpress.net/clients/Hargreaves/chartingTool.aspx?code=B8HTXL7&CodeType=SEDOL&InstrType=F

// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=FGWTB&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_

// https://webfund6.financialexpress.net/clients/Hargreaves/chartingTool.aspx?code=B8HTXL7&CodeType=SEDOL&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_

// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?code=B8HTXL7&CodeType=SEDOL&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_

export default ({
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
		pagination: {
			type: Object,
			default: () => {return { pageSize: 20 }},
		}
	},
	components: {
		// CardChartInfo,
		CardChartInfoIframe
	},
	data() {
		return {
			curExpandedRowKeys: [],
			selectedRowKeys: []
		}
	},
	methods: {
   		onExpand(rowkey) {
			if (this.curExpandedRowKeys.length > 0) {
				let index = this.curExpandedRowKeys.indexOf(rowkey);
				if (index > -1) {
					this.curExpandedRowKeys.splice(index, 1);
				} else {
					this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length);
					this.curExpandedRowKeys.push(rowkey);
				}
			} else {
				this.curExpandedRowKeys.push(rowkey);
			}
	    }
  	}
})

</script>