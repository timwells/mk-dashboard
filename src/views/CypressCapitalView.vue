<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Tab 1">
		</a-tab-pane>
		<a-tab-pane key="2" tab="Tab 2">
			<a-table v-if="indicators.length>0"
				:columns="columns"
				:data-source="indicators"
				:pagination="false"
				:rowKey="(record,index) => index">
                <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <!--iframe :src=getPDFlink(record) style="width:718px; height:700px;" frameborder="0"></iframe-->
                    <!--object class="pdf" :data="record.href" width="1000" height="900"></object-->

                    <object :data=getPDFlink2(record) type="application/pdf" width="1200" height="1000">
                        <param name="view" value="fitH" />
                    </object>

                    <!--PDFViewer
                        :source="record.href"
                        style="height: 100vh; width: 100vw"
                        @download="handleDownload"
                    /-->
    			</div>
			</a-table>
        </a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapState } from "vuex";
// import PDFViewer from 'pdf-viewer-vue'
// import PDFViewer from 'pdf-viewer-vue/dist/vue2-pdf-viewer'

const columns = [
	{ title:'Name', dataIndex:'title'},
	{ title:'Category', dataIndex:'category' },
	{ title:'Group', dataIndex:'group' },
]

export default ({
	components: {
        // PDFViewer
	},
	computed: {
    	 ...mapState("cyca", ["indicators"]),
	},
	watch: {
	},
	data() {
		return {
			columns,
		}
	},
	methods: {
        getPDFlink(record) {
            return `http://docs.google.com/gview?url=${record.href}&embedded=true`
        },

// https://www.cypresscapital.com/wp-content/uploads/Research/Charts/AllArms.pdf?08-19-2022-11-28
        getPDFlink2(record) {
            return `${record.href}#view=fitV`
        }
    },
	mounted() {
	    this.$store.dispatch("cyca/getIndicators");	    
	}
})
</script>

<style>
/* object { width:100%; max-height:100%; } */
.pdf {
        width: 100%;
        aspect-ratio: 4 / 3;
    }

</style>