<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="News">
            <a href="https://www.cypresscapital.com/research/" target="_blank">News / Research</a>
			<a-table v-if="news.length>0"
				:columns="NewsColumns"
				:data-source="news"
				:pagination="false"
				:rowKey="(record,index) => index">
                <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <pre>{{ getPDFNewsLink(record) }}</pre>
                    <object :data=getPDFNewsLink(record) style="width:100%;height:100vh;"></object>
    			</div>
			</a-table>
        </a-tab-pane>
		<a-tab-pane key="2" tab="Indicators">
            <a href="https://www.cypresscapital.com/charts/market-indicators/" target="_blank">Market Indicators</a>
			<a-table v-if="indicators.length>0"
				:columns="IndicatorColumns"
				:data-source="indicators"
				:pagination="false"
				:rowKey="(record,index) => index">
                <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <pre>{{ getPDFIndicatorLink(record) }}</pre>
                    <object :data=getPDFIndicatorLink(record) style="width:100%;height:100vh;"></object>
    			</div>
			</a-table>
        </a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapState } from "vuex";
import { CYPRESS_Columns } from '@/common/table'

const IndicatorColumns = [
	{ title:'Name', dataIndex:'title',
        sorter: (a, b) => a.title.localeCompare(b.title)},
	{ title:'Category', dataIndex:'category', 
        sorter: (a, b) => a.category.localeCompare(b.category)},
	{ title:'Group', dataIndex:'group',
        sorter: (a, b) => a.category.localeCompare(b.category)},
]

const NewsColumns = [
	{ title:'Title', dataIndex:'title'}
]

export default ({
	components: {
    },
	computed: {
    	...mapState("cyca", ["indicators","news"]),
	},
	watch: {
	},
	data() {
		return {
			IndicatorColumns,
			NewsColumns,

            CYPRESS_Columns
		}
	},
	methods: {
        // https://tinytip.co/tips/html-pdf-params/
        getPDFIndicatorLink(record) {
            const pdfCmd ='#toolbar=0&view=Fit';
            let url = record.href.split('?')
            if(url.length>1) return `${url[0]}${pdfCmd}?${url[1]}`
            else return `${url[0]}${pdfCmd}`
        },
        getPDFNewsLink(record) {
            const pdfCmd ='#toolbar=1&view=Fit';
            return `${record.href}${pdfCmd}`
        }
    },
	mounted() {
	    this.$store.dispatch("cyca/getIndicators");	    
	    this.$store.dispatch("cyca/getNews");	    
	}
})
</script>

<style>
</style>