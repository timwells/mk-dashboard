<template>
  <div>

    <CardPlatformSettings></CardPlatformSettings>

    <!--img src="images/I3E-STOCK.png"-->
    <div class="markdown prose w-full break-words dark:prose-invert light">
      <p>
        To evaluate i3 Energy (I3E) against a Discounted Cash Flow (DCF) model
        with a discount rate of 15%, we need to project the company's free cash
        flows into the future and then discount them back to their present
        value. Here’s a step-by-step approach:
      </p>
      <h3>Step-by-Step DCF Calculation</h3>
      <ol>
        <li>
          <p><strong>Project Free Cash Flows:</strong></p>
          <ul>
            <li>
              Use historical data to estimate future free cash flows. Given the
              TTM free cash flow is £28.841 million, we need to make assumptions
              about growth.
            </li>
          </ul>
        </li>
        <li>
          <p><strong>Estimate the Terminal Value:</strong></p>
          <ul>
            <li>
              The terminal value represents the value of the company beyond the
              projection period.
            </li>
          </ul>
        </li>
        <li>
          <p>
            <strong>Discount the Free Cash Flows and Terminal Value:</strong>
          </p>
          <ul>
            <li>
              Use the discount rate of 15% to discount future free cash flows
              and terminal value to their present value.
            </li>
          </ul>
        </li>
      </ol>
      <h3>Assumptions for Projections</h3>
      <ol>
        <li>
          <p><strong>Free Cash Flow Growth Rate:</strong></p>
          <ul>
            <li>
              Let’s assume a conservative annual growth rate of 5% for the next
              5 years.
            </li>
          </ul>
        </li>
        <li>
          <p><strong>Terminal Growth Rate:</strong></p>
          <ul>
            <li>Assume a terminal growth rate of 2% after 5 years.</li>
          </ul>
        </li>
      </ol>
      <h3>DCF Calculation</h3>
      <h4>Projected Free Cash Flows</h4>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Free Cash Flow (£ million)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024</td>
            <td>£28.841 * 1.05 = £30.283</td>
          </tr>
          <tr>
            <td>2025</td>
            <td>£30.283 * 1.05 = £31.797</td>
          </tr>
          <tr>
            <td>2026</td>
            <td>£31.797 * 1.05 = £33.387</td>
          </tr>
          <tr>
            <td>2027</td>
            <td>£33.387 * 1.05 = £35.056</td>
          </tr>
          <tr>
            <td>2028</td>
            <td>£35.056 * 1.05 = £36.808</td>
          </tr>
        </tbody>
      </table>
      <h4>Terminal Value</h4>
      <ul>
        <li>
          Terminal Value =
          <span class="math math-inline"><span class="katex">
            <span class="katex-mathml">
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                    <semantics>
                        <mrow>
                            <mfrac>
                                <mrow>
                                    <mi>F</mi>
                                    <mi>C</mi>
                                    <msub>
                                        <mi>F</mi>
                                        <mn>2028</mn>
                                        </msub>
                                        <mo>×</mo>
                                        <mo stretchy="false">(</mo><mn>1</mn
                          ><mo>+</mo
                          ><mtext>Terminal&nbsp;Growth&nbsp;Rate</mtext
                          ><mo stretchy="false">)</mo></mrow
                        ><mrow
                          ><mtext>Discount&nbsp;Rate</mtext><mo>−</mo
                          ><mtext>Terminal&nbsp;Growth&nbsp;Rate</mtext></mrow></mfrac></mrow>
                    <annotation encoding="application/x-tex">\frac{FCF_{2028} \times (1 + \text{Terminal Growth
                      Rate})}{\text{Discount Rate} - \text{Terminal Growth
                      Rate}}</annotation
                    ></semantics
                  ></math
                ></span
              ><span class="katex-html" aria-hidden="true"
                ><span class="base"
                  ><span
                    class="strut"
                    style="height: 1.4133em; vertical-align: -0.4033em"
                  ></span
                  ><span class="mord"
                    ><span class="mopen nulldelimiter"></span
                    ><span class="mfrac"
                      ><span class="vlist-t vlist-t2"
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 1.01em"
                            ><span style="top: -2.655em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord text mtight"
                                    ><span class="mord mtight"
                                      >Discount&nbsp;Rate</span
                                    ></span
                                  ><span class="mbin mtight">−</span
                                  ><span class="mord text mtight"
                                    ><span class="mord mtight"
                                      >Terminal&nbsp;Growth&nbsp;Rate</span
                                    ></span
                                  ></span
                                ></span
                              ></span
                            ><span style="top: -3.23em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span
                                class="frac-line"
                                style="border-bottom-width: 0.04em"
                              ></span></span
                            ><span style="top: -3.485em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span
                                    class="mord mathnormal mtight"
                                    style="margin-right: 0.07153em"
                                    >FC</span
                                  ><span class="mord mtight"
                                    ><span
                                      class="mord mathnormal mtight"
                                      style="margin-right: 0.13889em"
                                      >F</span
                                    ><span class="msupsub"
                                      ><span class="vlist-t vlist-t2"
                                        ><span class="vlist-r"
                                          ><span
                                            class="vlist"
                                            style="height: 0.3173em"
                                            ><span
                                              style="
                                                top: -2.357em;
                                                margin-left: -0.1389em;
                                                margin-right: 0.0714em;
                                              "
                                              ><span
                                                class="pstrut"
                                                style="height: 2.5em"
                                              ></span
                                              ><span
                                                class="sizing reset-size3 size1 mtight"
                                                ><span class="mord mtight"
                                                  ><span class="mord mtight"
                                                    >2028</span
                                                  ></span
                                                ></span
                                              ></span
                                            ></span
                                          ><span class="vlist-s">​</span></span
                                        ><span class="vlist-r"
                                          ><span
                                            class="vlist"
                                            style="height: 0.143em"
                                            ><span></span></span></span></span></span></span
                                  ><span class="mbin mtight">×</span
                                  ><span class="mopen mtight">(</span
                                  ><span class="mord mtight">1</span
                                  ><span class="mbin mtight">+</span
                                  ><span class="mord text mtight"
                                    ><span class="mord mtight"
                                      >Terminal&nbsp;Growth&nbsp;Rate</span
                                    ></span
                                  ><span class="mclose mtight">)</span></span
                                ></span
                              ></span
                            ></span
                          ><span class="vlist-s">​</span></span
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.4033em"
                            ><span></span></span></span></span></span
                    ><span
                      class="mclose nulldelimiter"
                    ></span></span></span></span></span
          ></span>
        </li>
        <li>
          Terminal Value =
          <span class="math math-inline"
            ><span class="katex"
              ><span class="katex-mathml"
                ><math xmlns="http://www.w3.org/1998/Math/MathML"
                  ><semantics
                    ><mrow
                      ><mfrac
                        ><mrow><mn>36.808</mn><mo>×</mo><mn>1.02</mn></mrow
                        ><mrow
                          ><mn>0.15</mn><mo>−</mo><mn>0.02</mn></mrow
                        ></mfrac
                      ></mrow
                    ><annotation encoding="application/x-tex"
                      >\frac{36.808 \times 1.02}{0.15 - 0.02}</annotation
                    ></semantics
                  ></math
                ></span
              ><span class="katex-html" aria-hidden="true"
                ><span class="base"
                  ><span
                    class="strut"
                    style="height: 1.2484em; vertical-align: -0.4033em"
                  ></span
                  ><span class="mord"
                    ><span class="mopen nulldelimiter"></span
                    ><span class="mfrac"
                      ><span class="vlist-t vlist-t2"
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.8451em"
                            ><span style="top: -2.655em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord mtight">0.15</span
                                  ><span class="mbin mtight">−</span
                                  ><span class="mord mtight">0.02</span></span
                                ></span
                              ></span
                            ><span style="top: -3.23em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span
                                class="frac-line"
                                style="border-bottom-width: 0.04em"
                              ></span></span
                            ><span style="top: -3.394em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord mtight">36.808</span
                                  ><span class="mbin mtight">×</span
                                  ><span class="mord mtight">1.02</span></span
                                ></span
                              ></span
                            ></span
                          ><span class="vlist-s">​</span></span
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.4033em"
                            ><span></span></span></span></span></span
                    ><span
                      class="mclose nulldelimiter"
                    ></span></span></span></span></span
          ></span>
        </li>
        <li>
          Terminal Value =
          <span class="math math-inline"
            ><span class="katex"
              ><span class="katex-mathml"
                ><math xmlns="http://www.w3.org/1998/Math/MathML"
                  ><semantics
                    ><mrow
                      ><mfrac><mn>37.544</mn><mn>0.13</mn></mfrac
                      ><mo>=</mo><mi mathvariant="normal">£</mi
                      ><mn>288.030</mn></mrow
                    ><annotation encoding="application/x-tex"
                      >\frac{37.544}{0.13} = £288.030</annotation
                    ></semantics
                  ></math
                ></span
              ><span class="katex-html" aria-hidden="true"
                ><span class="base"
                  ><span
                    class="strut"
                    style="height: 1.1901em; vertical-align: -0.345em"
                  ></span
                  ><span class="mord"
                    ><span class="mopen nulldelimiter"></span
                    ><span class="mfrac"
                      ><span class="vlist-t vlist-t2"
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.8451em"
                            ><span style="top: -2.655em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord mtight">0.13</span></span
                                ></span
                              ></span
                            ><span style="top: -3.23em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span
                                class="frac-line"
                                style="border-bottom-width: 0.04em"
                              ></span></span
                            ><span style="top: -3.394em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord mtight">37.544</span></span
                                ></span
                              ></span
                            ></span
                          ><span class="vlist-s">​</span></span
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.345em"
                            ><span></span></span></span></span></span
                    ><span class="mclose nulldelimiter"></span></span
                  ><span class="mspace" style="margin-right: 0.2778em"></span
                  ><span class="mrel">=</span
                  ><span
                    class="mspace"
                    style="margin-right: 0.2778em"
                  ></span></span
                ><span class="base"
                  ><span class="strut" style="height: 0.6944em"></span
                  ><span class="mord">£288.030</span></span
                ></span
              ></span
            ></span
          >
        </li>
      </ul>
      <h4>Discounting Free Cash Flows and Terminal Value</h4>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Free Cash Flow (£ million)</th>
            <th>Discount Factor (15%)</th>
            <th>Present Value (£ million)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024</td>
            <td>£30.283</td>
            <td>0.870</td>
            <td>£26.146</td>
          </tr>
          <tr>
            <td>2025</td>
            <td>£31.797</td>
            <td>0.756</td>
            <td>£24.018</td>
          </tr>
          <tr>
            <td>2026</td>
            <td>£33.387</td>
            <td>0.658</td>
            <td>£21.975</td>
          </tr>
          <tr>
            <td>2027</td>
            <td>£35.056</td>
            <td>0.572</td>
            <td>£20.073</td>
          </tr>
          <tr>
            <td>2028</td>
            <td>£36.808</td>
            <td>0.497</td>
            <td>£18.287</td>
          </tr>
          <tr>
            <td>Terminal Value</td>
            <td>£288.030</td>
            <td>0.497</td>
            <td>£143.191</td>
          </tr>
        </tbody>
      </table>
      <h4>Summing the Present Values</h4>
      <ul>
        <li>
          Total Present Value of Free Cash Flows = £26.146 + £24.018 + £21.975 +
          £20.073 + £18.287 = £110.499 million
        </li>
        <li>Present Value of Terminal Value = £143.191 million</li>
        <li>
          Total Enterprise Value (EV) = £110.499 + £143.191 = £253.690 million
        </li>
      </ul>
      <h3>Share Valuation</h3>
      <ul>
        <li><strong>Enterprise Value (EV):</strong> £253.690 million</li>
        <li>
          <strong>Less: Net Debt (Assumed, if any):</strong> If there's any net
          debt, subtract it from EV.
        </li>
        <li>
          <strong>Equity Value:</strong> If there's no debt, Equity Value = EV =
          £253.690 million
        </li>
        <li><strong>Number of Shares Outstanding:</strong> 1.20 billion</li>
        <li>
          <strong>Intrinsic Value per Share:</strong>
          <span class="math math-inline"
            ><span class="katex"
              ><span class="katex-mathml"
                ><math xmlns="http://www.w3.org/1998/Math/MathML"
                  ><semantics
                    ><mrow
                      ><mfrac
                        ><mrow
                          ><mi mathvariant="normal">£</mi><mn>253.690</mn
                          ><mtext>&nbsp;million</mtext></mrow
                        ><mrow
                          ><mn>1.20</mn
                          ><mtext>&nbsp;billion&nbsp;shares</mtext></mrow
                        ></mfrac
                      ><mo>=</mo><mi mathvariant="normal">£</mi
                      ><mn>0.211</mn></mrow
                    ><annotation encoding="application/x-tex"
                      >\frac{£253.690 \text{ million}}{1.20 \text{ billion
                      shares}} = £0.211</annotation
                    ></semantics
                  ></math
                ></span
              ><span class="katex-html" aria-hidden="true"
                ><span class="base"
                  ><span
                    class="strut"
                    style="height: 1.2251em; vertical-align: -0.345em"
                  ></span
                  ><span class="mord"
                    ><span class="mopen nulldelimiter"></span
                    ><span class="mfrac"
                      ><span class="vlist-t vlist-t2"
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.8801em"
                            ><span style="top: -2.655em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord mtight">1.20</span
                                  ><span class="mord text mtight"
                                    ><span class="mord mtight"
                                      >&nbsp;billion&nbsp;shares</span
                                    ></span
                                  ></span
                                ></span
                              ></span
                            ><span style="top: -3.23em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span
                                class="frac-line"
                                style="border-bottom-width: 0.04em"
                              ></span></span
                            ><span style="top: -3.394em"
                              ><span class="pstrut" style="height: 3em"></span
                              ><span class="sizing reset-size6 size3 mtight"
                                ><span class="mord mtight"
                                  ><span class="mord mtight">£253.690</span
                                  ><span class="mord text mtight"
                                    ><span class="mord mtight"
                                      >&nbsp;million</span
                                    ></span
                                  ></span
                                ></span
                              ></span
                            ></span
                          ><span class="vlist-s">​</span></span
                        ><span class="vlist-r"
                          ><span class="vlist" style="height: 0.345em"
                            ><span></span></span></span></span></span
                    ><span class="mclose nulldelimiter"></span></span
                  ><span class="mspace" style="margin-right: 0.2778em"></span
                  ><span class="mrel">=</span
                  ><span
                    class="mspace"
                    style="margin-right: 0.2778em"
                  ></span></span
                ><span class="base"
                  ><span class="strut" style="height: 0.6944em"></span
                  ><span class="mord">£0.211</span></span
                ></span
              ></span
            ></span
          >
        </li>
      </ul>
      <h3>Conclusion</h3>
      <ul>
        <li><strong>Intrinsic Value per Share:</strong> £0.211</li>
        <li><strong>Current Share Price:</strong> £0.109</li>
      </ul>
      <p>
        Based on a DCF analysis with a discount rate of 15%, the intrinsic value
        of I3E is approximately £0.211 per share, which is higher than the
        current share price of £0.109. This suggests that I3E may be undervalued
        according to this DCF analysis.
      </p>
      <p>
        However, it's essential to consider the assumptions made in the DCF
        model and also to analyze other factors such as market conditions,
        industry trends, and company-specific risks before making any investment
        decisions.
      </p>
    </div>
  </div>
</template>

import CardPlatformSettings from "@/components/Cards/CardPlatformSettings";
import CardChartFundInfo from '../components/Cards/CardChartFundInfo' ;

<script>
export default ({
	components: {
        CardPlatformSettings
    },
    data() {}
})
</script>

<style>
p {
    font-size: 15px;
}
</style>