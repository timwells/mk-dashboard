<template>
    <div :id="id"></div>
</template>

<script>
// https://codepen.io/Cleysense/pen/jeoMVq
export default ({
  props: [
      'id',        // DOM Id where chart will be placed
      'keywords',  // ',' separated list of key word terms e.g. btc,xrp
      'geo',       // Region of interest US, GB etc
      'search',    // e.g. date range 2018-01-01 2022-10-30
  ],
		
	components: {},
    created () {
      let kw = (this.keywords).split(',');
      const geo = this.geo ? this.geo : 'us';
      const search = this.search;
      let arr = [];
      for (let i = 0; i < kw.length; i++) {
        arr.push({ "keyword": kw[i],"geo": geo,"time": search });
      }

      const script = document.createElement("script");
      script.src = "https://ssl.gstatic.com/trends_nrtr/760_RC08/embed_loader.js";
      script.async = true;
      document.head.appendChild(script);
      kw = kw.join(',');
      kw = kw.match(/\[(.+)\]/)[1];

      script.onload = () => {
        var divElem = document.getElementById(this.id);
        trends.embed.renderExploreWidgetTo(divElem, "TIMESERIES", {
            "comparisonItem": arr,
            "category": 0, 
            "property": ""
          },{
            "exploreQuery": "q=" + kw + "&date=all&geo=" + geo,
            "guestPath": "https://trends.google.com:443/trends/embed/"
          });
        }
    },
    data() { return {} },
	methods: {},
	})

/*
Vue.component('google-trend', {
  template: '<div :id="id"></div>',
  props: [
    'id', // 要素のid設定
    'keywords', // キーワードは配列 (e.g. keywords="[サッカー,テニス]")
    'geo', // 言語、初期値はJPで省略可
    'search', // 期間 (e.g. 2004-01-01 2018-10-30)
  ],
  created: function () {
    let keywords = this.keywords;
    keywords = keywords.split(',');
    const geo = this.geo ? this.geo : 'UK';
    const search = this.search;
    let arr = [];

    for (let i = 0; i < keywords.length; i++) {
      arr.push({
        "keyword": keywords[i],
        "geo": geo,
        "time": search
      });
    }

    const script = document.createElement("script");
    script.src = "https://ssl.gstatic.com/trends_nrtr/760_RC08/embed_loader.js";
    script.async = true;
    document.head.appendChild(script);

    keywords = keywords.join(',');
    keywords = keywords.match(/\[(.+)\]/)[1];

    script.onload = () => {
      var divElem = document.getElementById(this.id);

      trends.embed.renderExploreWidgetTo(divElem, "TIMESERIES", {
          "comparisonItem": arr
          ,
          "category": 0, "property": ""
        },
        {
          "exploreQuery": "q=" + keywords + "&date=all&geo=" + geo,
          "guestPath": "https://trends.google.com:443/trends/embed/"
        });
    }
  }
});
*/

</script>
