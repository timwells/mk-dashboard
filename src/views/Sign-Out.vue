<template>
	<a-result status="success" title="Signed Out" sub-title="You have sucessfully signed out.">
		<template #extra>
			<router-link class="ant-btn ant-btn-primary" to="/sign-in">Sign In</router-link>
		</template>
	</a-result>
</template>

<script>

export default ({
	computed: {},
	data() {
		return {}
	},
	methods: {},
  mounted() {
		this.$store.dispatch("auth/signOut")
	}
})
</script>

<style>
</style>