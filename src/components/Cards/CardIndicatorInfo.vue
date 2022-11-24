<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}}</h6>
					<img v-if="type=='img'" :src="url" :height="height" width="100%">
					<iframe v-if="type=='iframe'" :src="url" :height="height" width='100%' frameborder='0' scrolling='no'></iframe>
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
		}
	},
	computed: {
	},
	data() {
		return {
		}
	},
	methods: {
	}		
})
</script>