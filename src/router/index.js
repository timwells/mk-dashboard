import Vue from 'vue'
import VueRouter from 'vue-router'
import { getCurrentUser } from '@/firebase'

Vue.use(VueRouter)

let routes = [
	{  // will match everything
		path: '*',
		component: () => import('../views/404.vue'),
	},{
		path: '/',
		name: 'Home',
		redirect: '/dashboard',
		meta: { requiresAuth: true }
	},
	{
		path: '/dashboard-bk',
		name: 'Dashboard-bk',
		layout: "dashboard",
		component: () => import('../views/Dashboard-bk.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		layout: "dashboard",
		component: () => import('../views/Dashboard.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/dcf',
		name: 'DCF',
		layout: "dashboard",
		component: () => import('../views/DCFNoteView.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/market-ratios',
		name: 'Ratios',
		layout: "dashboard",
		component: () => import('../views/Ratios.vue'),
		meta: { requiresAuth: true }
	},	
	{
		path: '/hl-index',
		name: 'HLi',
		layout: "dashboard",
		component: () => import('../views/IndexView.vue'),
		meta: { requiresAuth: true }
	},/*{
		path: '/layout',
		name: 'Layout',
		layout: "dashboard",
		component: () => import('../views/Layout.vue'),
		meta: { requiresAuth: true }
	},*/{
		path: '/premium-bonds',
		name: 'P.Bonds',
		layout: "dashboard",
		component: () => import('../views/PremiumBondsView.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/fed-insights',
		name: 'FEDi',
		layout: "dashboard",
		component: () => import('../views/FedInsightsView.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/models',
		name: 'Models',
		layout: "dashboard",
		component: () => import('../views/Models.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/stock-watch',
		name: 'Stock Watch',
		layout: "dashboard",
		component: () => import('../views/StockWatch.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/dividend-data',
		name: 'Dividends',
		layout: "dashboard",
		component: () => import('../views/DividendData.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/boe-irates',
		name: 'BoE-IRates',
		layout: "dashboard",
		component: () => import('../views/BoE.vue'),
		meta: { requiresAuth: true }
	},
	/*{
		path: '/stock-heatmap',
		name: 'Heatmap',
		layout: "dashboard",
		component: () => import('../views/StockHeatmap.vue'),
		meta: { requiresAuth: true }
	},*/
	{
		path: '/stock-screener',
		name: 'Screener',
		layout: "dashboard",
		component: () => import('../views/StockScreener.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/funds',
		name: 'Funds',
		layout: "dashboard",
		component: () => import('../views/Funds.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/etfs',
		name: 'ETFs',
		layout: "dashboard",
		component: () => import('../views/EtfsView.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/market-indicators',
		name: 'Market Indicators',
		layout: "dashboard",
		component: () => import( '../views/MarketIndicators.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/news',
		name: 'News',
		layout: "dashboard",
		component: () => import('../views/News.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/trading',
		name: 'Trading',
		layout: "dashboard",
		component: () => import('../views/TradingViewTechAnalysis.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/trades',
		name: 'Trades',
		layout: "dashboard",
		component: () => import('../views/NakedTrader.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/dataroma',
		name: 'Dataroma',
		layout: "dashboard",
		component: () => import( '../views/DataromaView.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/quotes',
		name: 'Quotes',
		layout: "dashboard",
		component: () => import('../views/TradingViewQuotes.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/trends',
		name: 'Trends',
		layout: "dashboard",
		component: () => import('../views/Trends.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/seeking-alpha',
		name: 'Seeking Alpha',
		layout: "dashboard",
		component: () => import('../views/SeekingAlpha.vue'),
		meta: { requiresAuth: true }
	},{
		path: '/fear-n-greed',
		name: 'Fear & Greed',
		layout: "dashboard",
		component: () => import('../views/CryptoFearNGreedIndex.vue'),
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
	},{
		path: '/sign-in',
		name: 'Sign-In',
		component: () => import('../views/Sign-In.vue'),
	},{
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
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return { selector: to.hash, behavior: 'smooth'}
		}
		return { x: 0, y: 0, behavior: 'smooth' }
	}
})

router.beforeEach(async (to, from, next) => {
	const reqAuth = to.matched.some(record => { return record.meta.requiresAuth});	
	if(reqAuth && !await getCurrentUser()) {
    	next('sign-in');
  	} else {
    	next();
  	}
})

export default router
