import Vue from 'vue'
import VueRouter from 'vue-router'
import { getCurrentUser } from '@/firebase'
Vue.use(VueRouter)

let routes = [
	{
		// will match everything
		path: '*',
		component: () => import('../views/404.vue'),
	},
	{
		path: '/',
		name: 'Home',
		redirect: '/dashboard',
		meta: { requiresAuth: true }
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		layout: "dashboard",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/layout',
		name: 'Layout',
		layout: "dashboard",
		component: () => import(/* webpackChunkName: "dashboard" */ '../views/Layout.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/funds',
		name: 'Funds',
		layout: "dashboard",
		component: () => import(/* webpackChunkName: "funds" */'../views/Funds.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/market-indicators',
		name: 'Market Indicators',
		layout: "dashboard",
		component: () => import(/* webpackChunkName: "market-indicators" */ '../views/MarketIndicators.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/news',
		name: 'News',
		layout: "dashboard",
		component: () => import(/* webpackChunkName: "trends" */ '../views/News.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/trading',
		name: 'Trading',
		layout: "dashboard",
		component: () => import(/* webpackChunkName: "trade-view" */ '../views/TradingView.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/trends',
		name: 'Trends',
		layout: "dashboard",
		component: () => import(/* webpackChunkName: "trends" */ '../views/Trends.vue'),
		meta: { requiresAuth: true }
	},
	/*
	{
		path: '/finviz',
		name: 'FinViz',
		layout: "dashboard",
		component: () => import('../views/FinViz.vue'),
		meta: {
      requiresAuth: true
    }
	},
	*/
	/*
	{
		path: '/billing',
		name: 'Billing',
		layout: "dashboard",
		component: () => import('../views/Billing.vue'),
	},
	{
		path: '/rtl',
		name: 'RTL',
		layout: "dashboard-rtl",
		meta: {
			layoutClass: 'dashboard-rtl',
		},
		component: () => import('../views/RTL.vue'),
	},*/
	{
		path: '/Profile',
		name: 'Profile',
		layout: "dashboard",
		meta: {
			layoutClass: 'layout-profile',
		},
		component: () => import('../views/Profile.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/sign-in',
		name: 'Sign-In',
		component: () => import('../views/Sign-In.vue'),
	},
	{
		path: '/sign-out',
		name: 'Sign-Out',
		component: () => import('../views/Sign-Out.vue'),
	},
	
	/*{
		path: '/sign-up',
		name: 'Sign-Up',
		meta: {
			layoutClass: 'layout-sign-up',
		},
		component: () => import('../views/Sign-Up.vue'),
	}*/
]

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute(
	route, 
	parentLayout = "default"
) {
	route.meta = route.meta || {} ;
	route.meta.layout = route.layout || parentLayout ;
	
	if(route.children){
		route.children = route.children.map((childRoute) => addLayoutToRoute(childRoute, route.meta.layout)) ;
	}
	return route ;
}

routes = routes.map((route) => addLayoutToRoute(route) ) ;

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if ( to.hash ) {
			return {
				selector: to.hash,
				behavior: 'smooth',
			}
		}
		return { x: 0, y: 0, behavior: 'smooth' }
	}
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => { return record.meta.requiresAuth;});
  if(requiresAuth && !await getCurrentUser()) {
    next('sign-in');
  } else {
    next();
  }
})

export default router
