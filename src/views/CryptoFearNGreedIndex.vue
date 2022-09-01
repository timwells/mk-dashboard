<template>
    <div>
        <div>
            <CardIndicatorInfo title="Rainbow" :url='url' type="iframe" height="680"/>
        </div>
        <div>
            <CardFearAGreedIndex title="Fear & Greed Index"></CardFearAGreedIndex>
        </div>
    </div>
</template>

<script>
import CardIndicatorInfo from '@/components/Cards/CardIndicatorInfo';
import CardFearAGreedIndex from '@/components/Cards/CardFearAGreedIndex';

export default {
    components:{
        CardIndicatorInfo,
        CardFearAGreedIndex
    },
    data() {          
        return {
            url: 'https://www.blockchaincenter.net/static/rainbow-chart.html'
        }
    }
}
</script>

<style>

</style>