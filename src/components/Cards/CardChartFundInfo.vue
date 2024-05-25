<template>
	<!--a-card hoverable style="padding: 12px;">
    	<template #cover>
      		<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
    	</template>
    	<a-card-meta title="Europe Street beat">
      		<template #description>www.instagram.com</template>
    	</a-card-meta>
  	</a-card-->

	<a-card hoverable style="padding: 2px;">
    	<a-card-meta :title='title'>
      		<template #description>{{ticker}}</template>
    	</a-card-meta>
    	<template #cover>
			<img v-if="ticker.length>0" :src="url" alt="Performance Chart" />
    	</template>
  	</a-card>


	<!--a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}} <sup>{{ticker}}</sup></h6>					
					<img v-if="ticker.length>0" :src="url" 
						alt="Performance Chart" 
						height="280"/>
				</div>
			</a-col>
		</a-row>
	</a-card-->
</template>

<script>
export default ({
	props: {
		title: {
			type: String,
			default: "",
		},
		ticker: {
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
			url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&color=f65d1a&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,
		}
	},
	methods: {
	}		
})
</script>