<template>
	<a-card :bordered="true" class="card-info">
		<a-row :gutter="24" type="flex">
			<a-col class="mb-12" :span="24" :xl="24">
				<div class="card-content">
					<h6 v-if="title.length>0">{{title}}</h6>
					<img v-if="type=='img'" :src="url" :height="height" width="99%">
					<iframe v-if="type=='iframe'" 
						:src="url" 
						:height="height" 
						width='99%' 
						frameborder='0' 
						:scrolling="scrolling">
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
		url: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			default: "",
		},
		height: {
			type: String,
			default: '400',
		},
		scrolling: {
			type: String,
			default: 'no',
		}
	},
	computed: {
	},
	data() {
		return {}
	},
	methods: {
	}		
})
</script>