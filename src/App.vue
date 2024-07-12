<template>
	<div id="app">
		<component :is="layout">
			<router-view />
		</component>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default ({
	watch: {
		user(n,o){
			if(this.$store.getters['auth/isAuthenticated']) {
				this.$store.dispatch('auth/fetchUserRole',{uid: this.$store.getters['auth/uid']})
				this.$store.dispatch('auth/fetchUserSecrets',{uid: this.$store.getters['auth/uid']})
				this.$store.dispatch('auth/fetchAppSecrets')
			}
		},
		appSecrets(n,o) {
			this.$router.push('/dashboard');
		},
	},
	computed: {
	    ...mapState("auth", ["user","appSecrets"]),

		// Sets components name based on current route's specified layout, defaults to
		// <layout-default></layout-default> component.
		layout() {
			return "layout-" + ( this.$route.meta.layout || "default" ).toLowerCase() ;
		}
	},
	created() {		
		console.log("Vue Created:",this.$store.getters['auth/isAuthenticated'])
		this.$store.dispatch('auth/fetchUser');		
	},
	methods:{
	}
})	
</script>

<style lang="scss">
</style>