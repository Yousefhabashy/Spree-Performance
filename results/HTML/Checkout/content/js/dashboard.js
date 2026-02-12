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

    var data = {"OkPercent": 97.87211405468666, "KoPercent": 2.127885945313331};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6041003727611601, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9825, 500, 1500, "TR - Fill payment details-5-0"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Fill payment details"], "isController": true}, {"data": [0.5325, 500, 1500, "TR - Fill payment details-5-1"], "isController": false}, {"data": [0.99, 500, 1500, "TR - Select shipping method-3-0"], "isController": false}, {"data": [0.56, 500, 1500, "TR - Select shipping method-3-1"], "isController": false}, {"data": [0.8875, 500, 1500, "TR - Login-8"], "isController": false}, {"data": [0.835, 500, 1500, "TR - Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Login-6"], "isController": false}, {"data": [0.1025, 500, 1500, "TR - Add to cart"], "isController": true}, {"data": [0.0, 500, 1500, "TR - Login-4"], "isController": false}, {"data": [0.4575, 500, 1500, "TR - Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Login user"], "isController": true}, {"data": [0.53, 500, 1500, "TR - Login-2"], "isController": false}, {"data": [0.435, 500, 1500, "TR - Login-1"], "isController": false}, {"data": [0.45, 500, 1500, "TR - Checkout address-1"], "isController": false}, {"data": [0.15, 500, 1500, "TR - Select shipping method"], "isController": true}, {"data": [0.5, 500, 1500, "TR - Fill payment details-1"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Fill payment details-2"], "isController": false}, {"data": [0.46, 500, 1500, "TR - Checkout address-3"], "isController": false}, {"data": [0.5525, 500, 1500, "TR - Checkout address-3-1"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Fill payment details-3"], "isController": false}, {"data": [0.4475, 500, 1500, "TR - Checkout address-2"], "isController": false}, {"data": [0.985, 500, 1500, "TR - Checkout address-3-0"], "isController": false}, {"data": [0.2625, 500, 1500, "TR - Fill payment details-4"], "isController": false}, {"data": [0.5375, 500, 1500, "TR - Checkout address-1-1"], "isController": false}, {"data": [0.475, 500, 1500, "TR - Fill payment details-5"], "isController": false}, {"data": [0.9725, 500, 1500, "TR - Checkout address-1-0"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Open home page"], "isController": true}, {"data": [0.42, 500, 1500, "TR - Add to cart-2"], "isController": false}, {"data": [0.7025, 500, 1500, "TR - Add to cart-1"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Checkout"], "isController": true}, {"data": [0.9925, 500, 1500, "TR - Fill payment details-4-1"], "isController": false}, {"data": [0.7725, 500, 1500, "TR - Fill payment details-4-0"], "isController": false}, {"data": [0.68, 500, 1500, "TR - Open home page-8"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Checkout address"], "isController": true}, {"data": [0.9, 500, 1500, "TR - Open home page-7"], "isController": false}, {"data": [0.63, 500, 1500, "TR - Open home page-6"], "isController": false}, {"data": [0.545, 500, 1500, "TR - Fill payment details-4-2"], "isController": false}, {"data": [0.8725, 500, 1500, "TR - Open home page-5"], "isController": false}, {"data": [0.895, 500, 1500, "TR - Open home page-4"], "isController": false}, {"data": [0.4725, 500, 1500, "TR - Select shipping method-3"], "isController": false}, {"data": [0.885, 500, 1500, "TR - Open home page-3"], "isController": false}, {"data": [0.9825, 500, 1500, "TR - Select shipping method-2"], "isController": false}, {"data": [0.9925, 500, 1500, "TR - Open home page-2"], "isController": false}, {"data": [0.985, 500, 1500, "TR - Select shipping method-1"], "isController": false}, {"data": [0.4547738693467337, 500, 1500, "TR - Open home page-1"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Search product"], "isController": true}, {"data": [0.535, 500, 1500, "TR - Checkout address-2-1"], "isController": false}, {"data": [0.9875, 500, 1500, "TR - Checkout address-2-0"], "isController": false}, {"data": [0.43, 500, 1500, "TR - Search product-3"], "isController": false}, {"data": [0.94, 500, 1500, "TR - Search product-4"], "isController": false}, {"data": [0.43, 500, 1500, "TR - Search product-1"], "isController": false}, {"data": [0.6225, 500, 1500, "TR - Search product-2"], "isController": false}, {"data": [0.9925, 500, 1500, "TR - Search product-5"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Search product-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9399, 200, 2.127885945313331, 660.689328651983, 40, 3845, 543.0, 1210.0, 1444.0, 1912.0, 14.052982390038665, 139.9279457470067, 24.577745708992325], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR - Fill payment details-5-0", 200, 0, 0.0, 302.5899999999999, 228, 1127, 279.0, 356.70000000000005, 417.79999999999995, 944.9800000000009, 0.3334505967932056, 0.5246539043313565, 0.5564131198638188], "isController": false}, {"data": ["TR - Fill payment details", 200, 0, 0.0, 3832.0950000000016, 3108, 5589, 3711.0, 4412.900000000001, 4751.099999999999, 5439.560000000002, 0.3313518492746708, 12.299152888642585, 6.5253566226051545], "isController": true}, {"data": ["TR - Fill payment details-5-1", 200, 0, 0.0, 741.6300000000002, 426, 2581, 701.5, 982.0, 1224.6999999999998, 1605.2900000000006, 0.33326779066783535, 5.145109547726447, 0.5425918579762646], "isController": false}, {"data": ["TR - Select shipping method-3-0", 200, 0, 0.0, 296.9650000000001, 231, 648, 283.0, 345.0, 405.0999999999998, 618.4200000000005, 0.3333238891564739, 0.6733435521410226, 0.4987781856597396], "isController": false}, {"data": ["TR - Select shipping method-3-1", 200, 0, 0.0, 755.4650000000001, 401, 2685, 720.0, 1029.9, 1199.8999999999996, 1757.3800000000024, 0.3329925709357424, 5.137992446583829, 0.48243924654603454], "isController": false}, {"data": ["TR - Login-8", 200, 0, 0.0, 476.255, 327, 1504, 428.0, 647.2000000000002, 848.0499999999995, 1308.1100000000017, 0.3328512537674601, 3.161280786660653, 0.4278308791100889], "isController": false}, {"data": ["TR - Login-7", 200, 0, 0.0, 497.45999999999975, 334, 1334, 428.5, 683.0, 916.2999999999996, 1227.0800000000008, 0.33226675704322456, 3.155993933951183, 0.42697576197074055], "isController": false}, {"data": ["TR - Login-6", 200, 0, 0.0, 279.175, 224, 425, 274.0, 318.0, 354.6499999999999, 410.8000000000002, 0.33280583608314157, 0.8253373481157366, 0.4240381859336285], "isController": false}, {"data": ["TR - Add to cart", 200, 0, 0.0, 1823.8899999999994, 1329, 4338, 1707.0, 2401.0, 2513.8, 3430.1100000000006, 0.3327609844400964, 5.030429692179451, 1.0899563298002435], "isController": true}, {"data": ["TR - Login-4", 200, 200, 100.0, 1053.4850000000001, 663, 2411, 978.0, 1449.5000000000002, 1630.75, 2143.550000000001, 0.3332072699162151, 5.089527912460619, 0.5389692670439684], "isController": false}, {"data": ["TR - Login-3", 200, 0, 0.0, 1050.61, 555, 2652, 983.5, 1449.4, 1646.5999999999992, 1951.850000000001, 0.3330868490650252, 7.9190324940793815, 0.3824481081916049], "isController": false}, {"data": ["TR - Login user", 200, 200, 100.0, 5236.335000000002, 3803, 7945, 5173.0, 6163.0, 6597.499999999999, 7908.150000000001, 0.33179436049125477, 33.03216827977481, 2.920231036708069], "isController": true}, {"data": ["TR - Login-2", 200, 0, 0.0, 777.1849999999996, 438, 2121, 733.0, 1099.0000000000002, 1345.1999999999998, 1903.6700000000003, 0.33362024674553453, 5.09042268538443, 0.3826793646702831], "isController": false}, {"data": ["TR - Login-1", 200, 0, 0.0, 1102.1649999999988, 601, 3061, 1014.0, 1553.9, 1889.1, 2156.92, 0.33463898309905815, 7.95540130325152, 0.34937747737422176], "isController": false}, {"data": ["TR - Checkout address-1", 200, 0, 0.0, 1126.7850000000003, 686, 2907, 1046.5, 1517.1000000000001, 1798.1499999999994, 2357.890000000002, 0.3325911008599143, 5.596933338557784, 0.90692786223744], "isController": false}, {"data": ["TR - Select shipping method", 200, 0, 0.0, 1671.9149999999997, 1182, 3562, 1611.0, 2045.3000000000002, 2182.95, 3359.4100000000017, 0.33206870501506763, 7.200092667922994, 2.2047805440945734], "isController": true}, {"data": ["TR - Fill payment details-1", 200, 0, 0.0, 802.7500000000003, 776, 1431, 797.0, 815.0, 844.5999999999999, 863.8800000000001, 0.3330014418962434, 0.11251806532822288, 1.20485384982967], "isController": false}, {"data": ["TR - Fill payment details-2", 200, 0, 0.0, 205.7449999999999, 200, 220, 205.0, 214.9, 218.0, 219.99, 0.33335777957050183, 0.11263846848768909, 1.3418952806539146], "isController": false}, {"data": ["TR - Checkout address-3", 200, 0, 0.0, 1060.6199999999994, 676, 2532, 1001.0, 1434.4, 1607.95, 1887.5000000000005, 0.33248107351489015, 5.700706200190179, 0.8877731695670099], "isController": false}, {"data": ["TR - Checkout address-3-1", 200, 0, 0.0, 744.325, 419, 2234, 695.0, 1086.9, 1260.5, 1569.8400000000001, 0.3326884721780948, 5.074961210603447, 0.4363157330041935], "isController": false}, {"data": ["TR - Fill payment details-3", 200, 0, 0.0, 205.935, 200, 222, 205.0, 214.9, 217.0, 220.0, 0.3333533345334054, 0.1126369665513264, 1.3382964436199505], "isController": false}, {"data": ["TR - Checkout address-2", 200, 0, 0.0, 1122.7000000000007, 681, 3387, 1051.0, 1511.4, 1754.6499999999996, 2799.700000000002, 0.3330369304652193, 5.7098742665902344, 1.2184387015348006], "isController": false}, {"data": ["TR - Checkout address-3-0", 200, 0, 0.0, 316.04499999999985, 229, 970, 287.0, 406.40000000000003, 464.74999999999994, 769.6700000000003, 0.3328479301019347, 0.6296026627834408, 0.4522278708133971], "isController": false}, {"data": ["TR - Fill payment details-4", 200, 0, 0.0, 1573.2850000000003, 1131, 3447, 1488.5, 1959.4, 2367.049999999998, 2952.5700000000015, 0.33259386630391763, 6.350101984192645, 1.5758908007031036], "isController": false}, {"data": ["TR - Checkout address-1-1", 200, 0, 0.0, 789.7100000000003, 424, 2613, 713.5, 1159.7, 1402.3499999999997, 1921.4800000000014, 0.3327914379418846, 5.084494186133579, 0.4101881966780759], "isController": false}, {"data": ["TR - Fill payment details-5", 200, 0, 0.0, 1044.3800000000008, 706, 2874, 998.5, 1341.8000000000002, 1502.7499999999998, 2377.780000000003, 0.3330602239496946, 5.665944745621091, 1.0980156427979058], "isController": false}, {"data": ["TR - Checkout address-1-0", 200, 0, 0.0, 336.90999999999997, 235, 1255, 301.0, 421.00000000000006, 506.74999999999994, 943.5000000000014, 0.33285623939020736, 0.5159109183087575, 0.49738278779582595], "isController": false}, {"data": ["TR - Open home page", 200, 0, 0.0, 4488.504999999998, 3464, 6744, 4418.0, 5298.7, 5617.15, 6150.380000000001, 0.33220880652325213, 25.119273018644392, 2.645287239153798], "isController": true}, {"data": ["TR - Add to cart-2", 200, 0, 0.0, 1229.3600000000001, 837, 3845, 1128.0, 1661.7, 1867.3999999999996, 2900.0700000000006, 0.3332144868330295, 1.7789651118184513, 0.6739181645004948], "isController": false}, {"data": ["TR - Add to cart-1", 200, 0, 0.0, 594.5249999999995, 388, 1749, 523.0, 834.5000000000001, 989.55, 1400.3100000000006, 0.3338491302395535, 3.264526114722246, 0.41831882863190295], "isController": false}, {"data": ["TR - Checkout", 200, 0, 0.0, 8814.114999999993, 7400, 10949, 8764.5, 9966.6, 10192.05, 10859.19, 0.3296245082414368, 36.23224064268127, 11.664830319088885], "isController": true}, {"data": ["TR - Fill payment details-4-1", 200, 0, 0.0, 294.1849999999999, 229, 698, 280.0, 357.9, 415.6499999999999, 670.5000000000014, 0.33322614558983527, 0.677880906641697, 0.47649060906241825], "isController": false}, {"data": ["TR - Fill payment details-4-0", 200, 0, 0.0, 525.7949999999996, 425, 1970, 495.0, 597.8, 646.75, 1667.7500000000057, 0.3331223558413005, 0.5335976017272395, 0.5200254682451114], "isController": false}, {"data": ["TR - Open home page-8", 200, 0, 0.0, 622.8399999999997, 401, 1581, 546.0, 893.6, 1212.9999999999993, 1538.010000000001, 0.334415725565079, 3.738168541449993, 0.352390570814202], "isController": false}, {"data": ["TR - Checkout address", 200, 0, 0.0, 3310.105, 2394, 5539, 3193.5, 4040.2000000000003, 4406.449999999999, 5242.59, 0.3321084068261562, 16.97708175668327, 3.0074313537112287], "isController": true}, {"data": ["TR - Open home page-7", 200, 0, 0.0, 449.31, 310, 1829, 397.0, 622.8, 715.3499999999999, 1533.3900000000015, 0.3350701134212334, 2.0021093710733973, 0.3453610851664461], "isController": false}, {"data": ["TR - Open home page-6", 200, 0, 0.0, 628.7250000000005, 419, 1624, 556.0, 896.8, 1092.9, 1395.5100000000004, 0.3351363669877273, 3.2426292647149997, 0.35436743429651524], "isController": false}, {"data": ["TR - Fill payment details-4-2", 200, 0, 0.0, 753.0000000000005, 423, 1868, 695.0, 1092.0, 1364.5999999999988, 1818.99, 0.33322781119312217, 5.1505548633557705, 0.5822114663689831], "isController": false}, {"data": ["TR - Open home page-5", 200, 0, 0.0, 468.275, 328, 1229, 421.5, 624.5, 731.5999999999999, 1175.910000000001, 0.3352397299308736, 3.2851201855384287, 0.3454016842444032], "isController": false}, {"data": ["TR - Open home page-4", 200, 0, 0.0, 463.4099999999999, 328, 1220, 421.5, 630.0, 711.3499999999999, 1177.0900000000008, 0.33523186311812564, 3.1321557598281604, 0.3458420825357609], "isController": false}, {"data": ["TR - Select shipping method-3", 200, 0, 0.0, 1052.6199999999992, 644, 3015, 1027.0, 1329.3000000000002, 1552.9499999999996, 2100.4100000000026, 0.3328501458715764, 5.808181412378864, 0.9803021884064966], "isController": false}, {"data": ["TR - Open home page-3", 200, 0, 0.0, 465.36499999999995, 323, 1538, 427.5, 601.2, 756.1999999999994, 1175.3300000000015, 0.33521669245041724, 3.1325754389453078, 0.3456038268756631], "isController": false}, {"data": ["TR - Select shipping method-2", 200, 0, 0.0, 306.37999999999994, 236, 2089, 284.0, 356.9, 406.84999999999997, 703.6500000000003, 0.3333672256679429, 0.7056186128923108, 0.6352078086272105], "isController": false}, {"data": ["TR - Open home page-2", 200, 0, 0.0, 284.21499999999986, 229, 674, 272.5, 327.0, 364.4999999999999, 670.0100000000009, 0.3352863764763078, 0.7799566589969908, 0.34196590975767177], "isController": false}, {"data": ["TR - Select shipping method-1", 200, 0, 0.0, 312.9149999999997, 231, 2067, 285.0, 365.70000000000005, 412.0999999999998, 1212.3600000000033, 0.3329083203776512, 0.7044538373717887, 0.595548277116215], "isController": false}, {"data": ["TR - Open home page-1", 199, 0, 0.0, 1104.974874371858, 657, 2313, 1057.0, 1474.0, 1712.0, 2129.0, 0.3345482421927536, 6.011866848538747, 0.23686276913061166], "isController": false}, {"data": ["TR - Search product", 200, 0, 0.0, 3714.0799999999995, 2443, 6212, 3659.5, 4485.5, 4941.199999999999, 5840.620000000001, 0.33123276554516773, 20.91661810311276, 2.2296121704233984], "isController": true}, {"data": ["TR - Checkout address-2-1", 200, 0, 0.0, 781.485, 401, 3030, 728.5, 1127.0, 1347.2999999999997, 2275.540000000005, 0.33318839638090764, 5.082474995772673, 0.4702349009430898], "isController": false}, {"data": ["TR - Checkout address-2-0", 200, 0, 0.0, 340.9850000000002, 237, 2280, 303.0, 430.30000000000007, 467.9, 787.9300000000001, 0.3334950784463798, 0.6305760116573206, 0.7494471407174147], "isController": false}, {"data": ["TR - Search product-3", 200, 0, 0.0, 1078.0899999999995, 573, 3148, 966.0, 1601.6, 1815.5, 2602.2700000000023, 0.33235951993990936, 7.264501144459234, 0.3940407730350074], "isController": false}, {"data": ["TR - Search product-4", 200, 0, 0.0, 386.5, 281, 1093, 353.0, 528.9, 594.4999999999999, 752.4000000000005, 0.3327598771450534, 1.8952754752642946, 0.40907692514067423], "isController": false}, {"data": ["TR - Search product-1", 200, 0, 0.0, 1083.645, 579, 3078, 997.0, 1615.2, 1873.0999999999995, 2356.630000000002, 0.3332183729946502, 7.938468910517538, 0.38970279212005193], "isController": false}, {"data": ["TR - Search product-2", 200, 0, 0.0, 767.2999999999997, 307, 1789, 767.0, 1108.8000000000002, 1193.4999999999995, 1542.9, 0.3335935362916408, 2.4757217530715625, 0.42388368917338853], "isController": false}, {"data": ["TR - Search product-5", 200, 0, 0.0, 286.8700000000001, 229, 664, 274.0, 333.8, 388.5999999999999, 648.95, 0.3330191852352614, 0.8256046431616175, 0.4007222457648285], "isController": false}, {"data": ["TR - Search product-6", 200, 0, 0.0, 111.67500000000003, 40, 266, 136.0, 160.0, 170.0, 244.70000000000027, 0.333581851812934, 0.624019582088656, 0.2244510702139761], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 200, 100.0, 2.127885945313331], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9399, 200, "422/Unprocessable Entity", 200, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TR - Login-4", 200, 200, "422/Unprocessable Entity", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
