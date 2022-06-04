<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<iframe 
						:src="url"
						:title="title" 
						width="100%" 
						height="1300" 
						style="border:none;">
					</iframe>
				</div>
			</a-col>
		</a-row>
	</a-card>
</template>

<script>
	export default ({
		props: {
			title: {
				type: String,
				default: "",
			},
			sedol: {
				type: String,
				default: "",
			}
		},
		computed: {
			chartUrl() {
			}
		},
		data() {
			return {
				url:`https://webfund6.financialexpress.net/clients/Hargreaves/chartingTool.aspx?code=${this.sedol}&CodeType=SEDOL&InstrType=F`,
			}
		},
		methods: {
		}		
	})

</script>