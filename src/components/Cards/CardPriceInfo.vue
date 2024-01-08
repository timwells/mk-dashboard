<template>
	<a-card :bordered="false" class="card-info">
        <!--p>{{epic}}</p-->
        <a-row>
            <a-col 
                :span="12" 
                :lg="12" 
                :xl="12" 
                class="mb-12" v-for="(dgnPriceModel, index) in dgnPriceModels" :key="index">
                    <!--img :src="dgnPriceModel" width="600"-->
                    <p>{{ dgnPriceModel }}</p>
            </a-col>			
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
        return {}
    },
    methods: {
    },
    mounted () {
        this.$store.dispatch("wscrape/getDgnPriceModels",{epic: this.epic});
    }
})
</script>