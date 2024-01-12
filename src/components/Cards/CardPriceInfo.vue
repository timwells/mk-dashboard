<template>
	<a-card :bordered="false" class="card-info">
        <!--p>{{epic}}</p-->
        <a-row v-if="dgnPriceModels.length>0">
            <a-col 
                :span="12" 
                :lg="12" 
                :xl="12" 
                class="mb-12" v-for="(dgnPriceModel, index) in dgnPriceModels" :key="index">
                    <img :src="dgnPriceModel" width="600">
                    <p>{{ dgnPriceModel }}</p>
            </a-col>
            <!--svg version="1.1"
                baseProfile="full"
                width="300"
                height="200"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="black" />
                <circle cx="150" cy="100" r="90" fill="blue" />
            </svg-->
            <!--img src="svg" width="300" height="200"/>
            <object :data="svg"  width="300" height="200"></object-->
        </a-row>
	</a-card>
</template>

<script>
import { mapState } from "vuex";

export default ({
    props: {
        epic: { type: String, default: "", }
    },
    computed: {...mapState("wscrape", ["dgnPriceModels"])},
    data() {
        return {
            svg: `<svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="black" />
                    <circle cx="150" cy="100" r="90" fill="blue" />
                </svg>`
        }
    },
    methods: {
    },
    mounted () {
        this.$store.dispatch("wscrape/getDgnPriceModels",{epic: this.epic});
    }
})
</script>