<template>	
	<!-- Main Sidebar -->
	<component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">
		<!-- Layout Header -->
		<a-layout-header>
			<a-row type="flex">
				<!-- Header Breadcrumbs & Title Column -->
				<a-col :span="24" :md="6">
					<!-- Header Breadcrumbs -->
					<a-breadcrumb>
						<a-breadcrumb-item><router-link to="/"> Views </router-link></a-breadcrumb-item>
						<a-breadcrumb-item>{{ this.$route.name }}</a-breadcrumb-item>
					</a-breadcrumb>
					
					<!-- / Header Breadcrumbs -->
					<!-- Header Page Title -->
					<!--div class="ant-page-header-heading">
						<span class="ant-page-header-heading-title">{{ this.$route.name }}</span>
					</div-->
					<!-- / Header Page Title -->

				</a-col>
				<!-- / Header Breadcrumbs & Title Column -->
				<!-- Header Control Column -->
				<a-col :span="24" :md="18" class="header-control">
					<!-- Header Control Buttons -->
					<a-button type="link" ref="secondarySidebarTriggerBtn" @click="$emit('toggleSettingsDrawer', true)">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path 
								fill-rule="evenodd" 
								clip-rule="evenodd" 
								d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" fill="#111827"/>
						</svg>
					</a-button>

					<!--a-button type="link" class="sidebar-toggler" @click="$emit('toggleSidebar', ! sidebarCollapsed) , resizeEventHandler()"-->
					<a-button type="link" @click="$emit('toggleSidebar', ! sidebarCollapsed) , resizeEventHandler()">
						<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/>
						</svg>
					</a-button>

					<router-link to="/sign-out" class="btn-sign-in" @click="e => e.preventDefault()">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path 
								fill-rule="evenodd" 
								clip-rule="evenodd" 
								d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="#111827"/>
						</svg>
						<span>Sign Out</span>
					</router-link>

				</a-col>
				<!-- / Header Control Column -->

			</a-row>
		</a-layout-header>
		<!--  /Layout Header -->
	</component>
	<!-- / Main Sidebar -->
</template>

<script>
// import { signOut } from "@firebase/auth";
export default ({
	props: {
		// Header fixed status.
		navbarFixed: {
			type: Boolean,
			default: false,
		},

		// Sidebar collapsed status.
		sidebarCollapsed: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			// Fixed header/sidebar-footer ( Affix component ) top offset.
			top: 0,

			// Search input loading status.
			searchLoading: false,

			// The wrapper element to attach dropdowns to.
			wrapper: document.body,
		}
	},
	methods: {
		resizeEventHandler(){
			this.top = this.top ? 0 : -0.01 ;
			// To refresh the header if the window size changes.
			// Reason for the negative value is that it doesn't activate the affix unless
			// scroller is anywhere but the top of the page.
		},
		onSearch(value){},
		signOut() {
			this.$store.dispatch("auth/signOut")
		}
	},
	mounted(){
		// Set the wrapper to the proper element, layout wrapper.
		this.wrapper = document.getElementById('layout-dashboard') ;
	},
	created() {
		// Registering window resize event listener to fix affix elements size
		// error while resizing.
		window.addEventListener("resize", this.resizeEventHandler);
	},
	destroyed() {
		// Removing window resize event listener.
		window.removeEventListener("resize", this.resizeEventHandler);
	},
})

</script>
