/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.4126144240436, "KoPercent": 1.5873855759563997};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5101393583036252, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9166666666666666, 500, 1500, "TR - Fill payment details-5-0"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Fill payment details"], "isController": true}, {"data": [0.435, 500, 1500, "TR - Fill payment details-5-1"], "isController": false}, {"data": [0.92, 500, 1500, "TR - Select shipping method-3-0"], "isController": false}, {"data": [0.44666666666666666, 500, 1500, "TR - Select shipping method-3-1"], "isController": false}, {"data": [0.4033333333333333, 500, 1500, "TR - Logout-1-2"], "isController": false}, {"data": [0.9383333333333334, 500, 1500, "TR - Logout-1-1"], "isController": false}, {"data": [0.95, 500, 1500, "TR - Logout-1-0"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "TR - Add to cart"], "isController": true}, {"data": [0.30333333333333334, 500, 1500, "TR - Checkout address-1"], "isController": false}, {"data": [0.6433333333333333, 500, 1500, "TR - Signup-270"], "isController": false}, {"data": [0.085, 500, 1500, "TR - Select shipping method"], "isController": true}, {"data": [0.61, 500, 1500, "TR - Signup-271"], "isController": false}, {"data": [0.5, 500, 1500, "TR - Fill payment details-1"], "isController": false}, {"data": [0.2683333333333333, 500, 1500, "TR - Signup-272"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Fill payment details-2"], "isController": false}, {"data": [0.3466666666666667, 500, 1500, "TR - Checkout address-3"], "isController": false}, {"data": [0.475, 500, 1500, "TR - Checkout address-3-1"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Fill payment details-3"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Singup"], "isController": true}, {"data": [0.31, 500, 1500, "TR - Checkout address-2"], "isController": false}, {"data": [0.9066666666666666, 500, 1500, "TR - Checkout address-3-0"], "isController": false}, {"data": [0.08833333333333333, 500, 1500, "TR - Fill payment details-4"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Logout"], "isController": true}, {"data": [0.44333333333333336, 500, 1500, "TR - Checkout address-1-1"], "isController": false}, {"data": [0.31166666666666665, 500, 1500, "TR - Fill payment details-5"], "isController": false}, {"data": [0.885, 500, 1500, "TR - Checkout address-1-0"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Open home page"], "isController": true}, {"data": [0.22, 500, 1500, "TR - Add to cart-2"], "isController": false}, {"data": [0.5083333333333333, 500, 1500, "TR - Add to cart-1"], "isController": false}, {"data": [0.22833333333333333, 500, 1500, "TR - Signup-277"], "isController": false}, {"data": [0.42, 500, 1500, "TR - Signup-278"], "isController": false}, {"data": [0.4033333333333333, 500, 1500, "TR - Signup-279"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Checkout"], "isController": true}, {"data": [0.9266666666666666, 500, 1500, "TR - Fill payment details-4-1"], "isController": false}, {"data": [0.6183333333333333, 500, 1500, "TR - Fill payment details-4-0"], "isController": false}, {"data": [0.4975, 500, 1500, "TR - Open home page-8"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Checkout address"], "isController": true}, {"data": [0.7025, 500, 1500, "TR - Open home page-7"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Signup-284"], "isController": false}, {"data": [0.46416666666666667, 500, 1500, "TR - Open home page-6"], "isController": false}, {"data": [0.42333333333333334, 500, 1500, "TR - Fill payment details-4-2"], "isController": false}, {"data": [0.6341666666666667, 500, 1500, "TR - Open home page-5"], "isController": false}, {"data": [0.6458333333333334, 500, 1500, "TR - Open home page-4"], "isController": false}, {"data": [0.345, 500, 1500, "TR - Select shipping method-3"], "isController": false}, {"data": [0.6516666666666666, 500, 1500, "TR - Open home page-3"], "isController": false}, {"data": [0.925, 500, 1500, "TR - Select shipping method-2"], "isController": false}, {"data": [0.9325, 500, 1500, "TR - Open home page-2"], "isController": false}, {"data": [0.9283333333333333, 500, 1500, "TR - Select shipping method-1"], "isController": false}, {"data": [0.3005008347245409, 500, 1500, "TR - Open home page-1"], "isController": false}, {"data": [0.28, 500, 1500, "TR - Signup-286"], "isController": false}, {"data": [0.9266666666666666, 500, 1500, "TR - Signup-287"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "TR - Checkout address-2-1"], "isController": false}, {"data": [0.915, 500, 1500, "TR - Checkout address-2-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "TR - Logout-5-0"], "isController": false}, {"data": [0.28833333333333333, 500, 1500, "TR - Logout-5-1"], "isController": false}, {"data": [0.27166666666666667, 500, 1500, "TR - Logout-3"], "isController": false}, {"data": [0.9133333333333333, 500, 1500, "TR - Logout-2"], "isController": false}, {"data": [0.2, 500, 1500, "TR - Logout-5"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "TR - Logout-4"], "isController": false}, {"data": [0.22, 500, 1500, "TR - Logout-1"], "isController": false}, {"data": [0.6433333333333333, 500, 1500, "TR - Logout-7"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "TR - Logout-6"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18899, 300, 1.5873855759563997, 938.8767659664564, 200, 22105, 755.0, 1872.0, 2330.0, 3484.0, 18.875160672071175, 189.77905709776053, 33.98433559664144], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR - Fill payment details-5-0", 300, 0, 0.0, 401.02000000000004, 233, 1818, 326.5, 703.7000000000005, 841.9, 1394.1500000000017, 0.32992629446581634, 0.5194255618919733, 0.550695529306253], "isController": false}, {"data": ["TR - Fill payment details", 300, 0, 0.0, 4867.103333333336, 3011, 11585, 4551.5, 6549.6, 7318.749999999999, 8499.79, 0.32857843824477784, 12.196349241983233, 6.471151258072077], "isController": true}, {"data": ["TR - Fill payment details-5-1", 300, 0, 0.0, 1067.9466666666674, 438, 4115, 935.0, 1766.4000000000005, 2092.349999999999, 3119.730000000003, 0.32965873727517275, 5.089099244930398, 0.5370325404765987], "isController": false}, {"data": ["TR - Select shipping method-3-0", 300, 0, 0.0, 393.4266666666669, 233, 3102, 314.0, 616.8000000000001, 816.95, 1685.6700000000012, 0.3307323074752116, 0.6677993444334446, 0.4944943233933576], "isController": false}, {"data": ["TR - Select shipping method-3-1", 300, 0, 0.0, 1007.4733333333337, 417, 4529, 866.0, 1681.0000000000014, 2007.9, 2966.920000000003, 0.33057814812325276, 5.100848804161098, 0.4786323926915783], "isController": false}, {"data": ["TR - Logout-1-2", 300, 0, 0.0, 1188.4300000000005, 457, 4999, 1018.5, 2019.9000000000003, 2366.7999999999997, 4222.450000000003, 0.3274208405547819, 5.033421823363005, 0.4791045135508572], "isController": false}, {"data": ["TR - Logout-1-1", 300, 0, 0.0, 386.01666666666654, 234, 2799, 320.5, 557.000000000001, 845.95, 1162.6000000000004, 0.328592474137034, 0.4917292247408227, 0.5070036405307864], "isController": false}, {"data": ["TR - Logout-1-0", 300, 0, 0.0, 343.59333333333325, 212, 1763, 269.5, 494.6000000000005, 823.95, 1407.700000000002, 0.32861910963938434, 0.46596734922681404, 0.5048282704995339], "isController": false}, {"data": ["TR - Add to cart", 300, 0, 0.0, 2733.0766666666673, 1426, 7490, 2529.0, 3948.900000000001, 4416.9, 6776.9400000000005, 0.3309986892451906, 5.0038479028612635, 1.0842976169887284], "isController": true}, {"data": ["TR - Checkout address-1", 300, 0, 0.0, 1594.3733333333328, 705, 22105, 1362.0, 2351.4000000000024, 2886.5, 4388.970000000002, 0.3313877192129763, 5.577561675396892, 0.9036787764944482], "isController": false}, {"data": ["TR - Signup-270", 300, 0, 0.0, 759.9399999999998, 329, 6570, 649.0, 1226.8000000000002, 1488.75, 2993.790000000001, 0.33325150157572414, 3.1137189159661904, 0.353003595783702], "isController": false}, {"data": ["TR - Select shipping method", 300, 0, 0.0, 2192.2233333333334, 1208, 6310, 1895.0, 3383.0000000000014, 4089.6999999999994, 5735.340000000002, 0.3302477188138823, 7.159700667251756, 2.1918450795566753], "isController": true}, {"data": ["TR - Signup-271", 300, 0, 0.0, 776.4466666666659, 331, 3632, 650.0, 1399.0000000000018, 1743.3499999999997, 3043.7500000000064, 0.3335998425408743, 3.11728311457987, 0.35309675521333156], "isController": false}, {"data": ["TR - Fill payment details-1", 300, 0, 0.0, 795.0900000000004, 777, 877, 795.0, 806.9000000000001, 811.0, 820.99, 0.3306615877046795, 0.11172745053302648, 1.1963878734822633], "isController": false}, {"data": ["TR - Signup-272", 300, 0, 0.0, 1561.6866666666667, 605, 4952, 1428.0, 2484.9, 2935.2999999999997, 4298.96, 0.33285180771816775, 7.912989390972726, 0.3477261228755733], "isController": false}, {"data": ["TR - Fill payment details-2", 300, 0, 0.0, 204.76333333333346, 200, 216, 205.0, 208.0, 209.0, 213.99, 0.33090193941626694, 0.11180866312307455, 1.3320095647205588], "isController": false}, {"data": ["TR - Checkout address-3", 300, 0, 0.0, 1380.6566666666665, 721, 3859, 1224.5, 2146.1000000000004, 2498.8, 3461.370000000001, 0.33025135430576213, 5.662332550522953, 0.8820377251626212], "isController": false}, {"data": ["TR - Checkout address-3-1", 300, 0, 0.0, 966.1833333333335, 457, 2680, 861.0, 1514.8000000000004, 1816.499999999999, 2365.1500000000015, 0.33038810690918624, 5.03965651028388, 0.43336982171707106], "isController": false}, {"data": ["TR - Fill payment details-3", 300, 0, 0.0, 204.87666666666652, 200, 219, 205.0, 208.0, 209.0, 214.98000000000002, 0.330900844458955, 0.1118082931472641, 1.3284505581745745], "isController": false}, {"data": ["TR - Singup", 300, 300, 100.0, 10549.186666666668, 5463, 21197, 9863.0, 14800.800000000001, 15963.699999999999, 20041.920000000016, 0.3289560251585568, 43.661484058722486, 3.5521832365928487], "isController": true}, {"data": ["TR - Checkout address-2", 300, 0, 0.0, 1477.2366666666662, 715, 6464, 1314.5, 2309.600000000001, 2639.9, 3881.600000000004, 0.3318400530944085, 5.689891365590952, 1.2148662183369283], "isController": false}, {"data": ["TR - Checkout address-3-0", 300, 0, 0.0, 414.2433333333332, 234, 2690, 332.0, 669.9000000000008, 876.0999999999998, 2005.95, 0.33064883220343283, 0.6255139694998495, 0.4493874971481538], "isController": false}, {"data": ["TR - Fill payment details-4", 300, 0, 0.0, 2193.2133333333322, 1125, 8323, 1990.0, 3054.9000000000005, 3782.65, 4923.160000000001, 0.32965656379184166, 6.2941374941211246, 1.5619067898813017], "isController": false}, {"data": ["TR - Logout", 300, 0, 0.0, 14149.746666666659, 7614, 39573, 12807.5, 20704.6, 22470.35, 30700.510000000017, 0.31973159598289225, 50.30499146982746, 8.925286686003323], "isController": true}, {"data": ["TR - Checkout address-1-1", 300, 0, 0.0, 1134.7599999999995, 447, 21268, 966.0, 1660.7, 2041.3999999999999, 3638.850000000002, 0.33150270174701923, 5.0655943705316195, 0.40868930738035514], "isController": false}, {"data": ["TR - Fill payment details-5", 300, 0, 0.0, 1469.1600000000003, 684, 4546, 1309.5, 2313.9, 2574.45, 3653.82, 0.32955661453081025, 5.606366276842387, 1.0869446559099387], "isController": false}, {"data": ["TR - Checkout address-1-0", 300, 0, 0.0, 459.44000000000005, 240, 3169, 350.0, 846.0000000000003, 1123.55, 1950.720000000002, 0.3323492103936676, 0.5152148429926938, 0.4965678020084971], "isController": false}, {"data": ["TR - Open home page", 600, 0, 0.0, 6817.803333333329, 3462, 22038, 6135.5, 10069.599999999999, 11553.649999999998, 15879.500000000007, 0.6110247190050074, 46.93026273044543, 6.253143833563995], "isController": true}, {"data": ["TR - Add to cart-2", 300, 0, 0.0, 1775.3400000000001, 850, 5950, 1570.5, 2712.6000000000004, 3217.35, 4872.390000000003, 0.33152394929009676, 1.7700842820213456, 0.670568700671999], "isController": false}, {"data": ["TR - Add to cart-1", 300, 0, 0.0, 957.7366666666666, 400, 4256, 798.0, 1672.5000000000011, 2013.1499999999996, 2896.7700000000013, 0.33172630368437345, 3.243682859978327, 0.41570316301030563], "isController": false}, {"data": ["TR - Signup-277", 300, 0, 0.0, 1673.2733333333322, 601, 7406, 1527.5, 2549.8, 2947.099999999999, 4599.890000000002, 0.3324298628394386, 7.902869629803334, 0.38156282342655407], "isController": false}, {"data": ["TR - Signup-278", 300, 0, 0.0, 1146.753333333333, 447, 5451, 1049.0, 1821.0000000000005, 2189.95, 3006.4200000000023, 0.3332540929156845, 5.085030042162197, 0.38231143858571404], "isController": false}, {"data": ["TR - Signup-279", 300, 0, 0.0, 1144.983333333334, 449, 3965, 1013.5, 1836.7000000000007, 2257.45, 2889.800000000002, 0.33274732831624304, 5.05465071582269, 0.38981046226922583], "isController": false}, {"data": ["TR - Checkout", 300, 0, 0.0, 11511.593333333327, 7420, 32313, 10777.0, 15551.400000000003, 16230.599999999999, 19427.96000000001, 0.32663229043272246, 35.9038317812402, 11.559556098891736], "isController": true}, {"data": ["TR - Fill payment details-4-1", 300, 0, 0.0, 391.07999999999987, 234, 2210, 319.0, 574.0, 838.5999999999999, 1526.4300000000005, 0.33024590109795754, 0.6720031078891343, 0.47200653419035815], "isController": false}, {"data": ["TR - Fill payment details-4-0", 300, 0, 0.0, 676.2499999999998, 420, 2391, 567.0, 1062.4, 1277.8499999999995, 1931.3900000000006, 0.33060583519299114, 0.5293438507314654, 0.5160679601619969], "isController": false}, {"data": ["TR - Open home page-8", 600, 0, 0.0, 978.7533333333338, 404, 6889, 808.5, 1669.1, 2037.6999999999996, 3769.0000000000045, 0.6147213468134894, 6.963690283022831, 0.8079123377904046], "isController": false}, {"data": ["TR - Checkout address", 300, 0, 0.0, 4452.266666666663, 2305, 25782, 4140.0, 6412.600000000002, 7110.9, 9207.32000000001, 0.3296359171295304, 16.85195595995473, 2.986092583397887], "isController": true}, {"data": ["TR - Open home page-7", 600, 0, 0.0, 664.0700000000002, 305, 10935, 535.0, 1093.3999999999999, 1330.349999999999, 2108.6900000000005, 0.6150017373799082, 3.7666624230479075, 0.7937626427700909], "isController": false}, {"data": ["TR - Signup-284", 300, 300, 100.0, 1567.5766666666664, 676, 3791, 1447.0, 2466.5000000000023, 2631.5499999999997, 3570.92, 0.3323293295034225, 5.1318420550858015, 0.5303595304851233], "isController": false}, {"data": ["TR - Open home page-6", 600, 0, 0.0, 1009.7183333333336, 446, 5918, 861.5, 1683.9, 2079.399999999999, 3106.5400000000022, 0.615338543883381, 6.045478854531917, 0.8113735458781035], "isController": false}, {"data": ["TR - Fill payment details-4-2", 300, 0, 0.0, 1125.463333333333, 423, 6426, 1006.0, 1818.7000000000019, 2150.0499999999993, 3298.090000000002, 0.329920489162112, 5.099589163074199, 0.5766176757651407], "isController": false}, {"data": ["TR - Open home page-5", 600, 0, 0.0, 743.4133333333331, 336, 3845, 617.0, 1210.8, 1706.6999999999969, 2792.700000000002, 0.6156359211247258, 6.125229717169162, 0.794925854990037], "isController": false}, {"data": ["TR - Open home page-4", 600, 0, 0.0, 727.121666666667, 338, 5813, 587.0, 1185.9, 1606.85, 3110.7900000000072, 0.6160505818597746, 5.848486827362605, 0.7951704971322845], "isController": false}, {"data": ["TR - Select shipping method-3", 300, 0, 0.0, 1401.123333333333, 708, 4843, 1234.5, 2183.5000000000014, 2682.6499999999983, 3805.090000000002, 0.33039283708329203, 5.765103340684574, 0.9723508517252013], "isController": false}, {"data": ["TR - Open home page-3", 600, 0, 0.0, 735.9833333333335, 334, 11185, 589.5, 1176.2999999999997, 1493.249999999999, 3007.8100000000004, 0.6163036980276227, 5.850575820248864, 0.7959807016052657], "isController": false}, {"data": ["TR - Select shipping method-2", 300, 0, 0.0, 405.0166666666668, 231, 4089, 319.5, 585.3000000000006, 847.7999999999995, 1846.870000000001, 0.3307527270562346, 0.699636764598874, 0.6302045319738661], "isController": false}, {"data": ["TR - Open home page-2", 600, 0, 0.0, 417.9316666666668, 232, 12185, 324.5, 591.7999999999997, 870.7999999999997, 1939.930000000001, 0.616526612371223, 1.5261953728521755, 0.7893206384081695], "isController": false}, {"data": ["TR - Select shipping method-1", 300, 0, 0.0, 386.08333333333326, 241, 4301, 311.0, 546.0, 815.8999999999997, 1224.1400000000008, 0.3308610659240674, 0.6998583931870191, 0.5917760346301248], "isController": false}, {"data": ["TR - Open home page-1", 599, 0, 0.0, 1538.5809682804675, 541, 5273, 1350.0, 2491.0, 3130.0, 4265.0, 0.6151621553063641, 11.144971002845253, 0.7119261144935901], "isController": false}, {"data": ["TR - Signup-286", 300, 0, 0.0, 1528.253333333334, 603, 4442, 1394.0, 2483.300000000002, 2816.2, 3820.1500000000015, 0.33163132766391157, 6.010162539768123, 0.4309156154414179], "isController": false}, {"data": ["TR - Signup-287", 300, 0, 0.0, 390.2733333333332, 234, 1812, 328.0, 652.7, 830.8, 1189.8700000000001, 0.3319219275370176, 0.8227676850077503, 0.4229303388535638], "isController": false}, {"data": ["TR - Checkout address-2-1", 300, 0, 0.0, 1073.6266666666663, 440, 6118, 924.0, 1604.7000000000012, 2174.2499999999995, 3512.190000000004, 0.33196636959365106, 5.063884377565823, 0.46899759158398857], "isController": false}, {"data": ["TR - Checkout address-2-0", 300, 0, 0.0, 403.4033333333333, 239, 2066, 335.0, 638.9000000000001, 868.8, 1577.9600000000028, 0.3324287577469752, 0.6290478395455035, 0.747370618381205], "isController": false}, {"data": ["TR - Logout-5-0", 300, 0, 0.0, 382.3933333333332, 230, 3570, 307.5, 679.6000000000001, 828.8999999999997, 1173.8700000000001, 0.3232180450479763, 0.5221339212220658, 0.570526143760922], "isController": false}, {"data": ["TR - Logout-5-1", 300, 0, 0.0, 1489.4033333333323, 548, 4550, 1332.0, 2469.7000000000003, 2899.2999999999993, 3562.4600000000014, 0.3228403059665193, 5.863561835218004, 0.5621940247371005], "isController": false}, {"data": ["TR - Logout-3", 300, 0, 0.0, 1618.7333333333336, 640, 4731, 1394.0, 2651.9000000000005, 3260.5499999999997, 4561.510000000002, 0.3230398480420555, 7.717021324600669, 0.4709567659619373], "isController": false}, {"data": ["TR - Logout-2", 300, 0, 0.0, 481.76999999999975, 247, 11547, 359.5, 649.0, 849.75, 1273.8000000000002, 0.3236528758176281, 0.8820994775433453, 0.4817834338814934], "isController": false}, {"data": ["TR - Logout-5", 300, 0, 0.0, 1871.9599999999994, 806, 5659, 1733.5, 2973.0, 3552.35, 5019.41000000001, 0.32275382167421013, 6.383375075040264, 1.1317501440288928], "isController": false}, {"data": ["TR - Logout-4", 300, 0, 0.0, 384.4400000000001, 225, 3091, 327.0, 524.4000000000002, 815.8, 1797.2400000000052, 0.3233019910014279, 0.8229782680442924, 0.47708091979416445], "isController": false}, {"data": ["TR - Logout-1", 300, 0, 0.0, 1918.3066666666655, 964, 6109, 1641.5, 3126.900000000002, 3569.0499999999993, 5501.350000000007, 0.3272240601306933, 5.984067392340557, 1.4863939894939262], "isController": false}, {"data": ["TR - Logout-7", 300, 0, 0.0, 758.3633333333333, 330, 3410, 632.5, 1363.2000000000007, 1568.95, 3172.580000000004, 0.32256885232152804, 3.0851757670956115, 0.4753711457054258], "isController": false}, {"data": ["TR - Logout-6", 300, 0, 0.0, 388.50666666666666, 236, 1983, 323.0, 551.7000000000005, 839.8, 1622.2100000000025, 0.3227416689617185, 0.8218366559364028, 0.47209794053162013], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 300, 100.0, 1.5873855759563997], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18899, 300, "422/Unprocessable Entity", 300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TR - Signup-284", 300, 300, "422/Unprocessable Entity", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
