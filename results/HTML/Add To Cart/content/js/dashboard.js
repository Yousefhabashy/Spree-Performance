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

    var data = {"OkPercent": 95.65071930411509, "KoPercent": 4.349280695884912};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6157024793388429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7269230769230769, 500, 1500, "TR - Open home page-8"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "TR - Open home page-7"], "isController": false}, {"data": [0.6807692307692308, 500, 1500, "TR - Open home page-6"], "isController": false}, {"data": [0.9076923076923077, 500, 1500, "TR - Open home page-5"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "TR - Open home page-4"], "isController": false}, {"data": [0.8884615384615384, 500, 1500, "TR - Open home page-3"], "isController": false}, {"data": [0.9961538461538462, 500, 1500, "TR - Open home page-2"], "isController": false}, {"data": [0.4728682170542636, 500, 1500, "TR - Open home page-1"], "isController": false}, {"data": [0.8653846153846154, 500, 1500, "TR - Login-8"], "isController": false}, {"data": [0.8769230769230769, 500, 1500, "TR - Login-7"], "isController": false}, {"data": [0.9884615384615385, 500, 1500, "TR - Login-6"], "isController": false}, {"data": [0.11153846153846154, 500, 1500, "TR - Add to cart"], "isController": true}, {"data": [0.0, 500, 1500, "TR - Search product"], "isController": true}, {"data": [0.0, 500, 1500, "TR - Login-4"], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "TR - Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Login user"], "isController": true}, {"data": [0.5423076923076923, 500, 1500, "TR - Login-2"], "isController": false}, {"data": [0.46923076923076923, 500, 1500, "TR - Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Open home page"], "isController": true}, {"data": [0.4653846153846154, 500, 1500, "TR - Add to cart-2"], "isController": false}, {"data": [0.7423076923076923, 500, 1500, "TR - Add to cart-1"], "isController": false}, {"data": [0.4846153846153846, 500, 1500, "TR - Search product-3"], "isController": false}, {"data": [0.9423076923076923, 500, 1500, "TR - Search product-4"], "isController": false}, {"data": [0.48846153846153845, 500, 1500, "TR - Search product-1"], "isController": false}, {"data": [0.6615384615384615, 500, 1500, "TR - Search product-2"], "isController": false}, {"data": [0.9846153846153847, 500, 1500, "TR - Search product-5"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Search product-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2989, 130, 4.349280695884912, 614.7892271662765, 41, 3335, 505.0, 1067.0, 1230.0, 1582.1, 6.794231835829174, 74.81136422432898, 7.909230148068337], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR - Open home page-8", 130, 0, 0.0, 567.1384615384615, 398, 2310, 508.0, 763.0, 920.0, 2035.959999999998, 0.3369019019408141, 3.7657873162588853, 0.3550022805667208], "isController": false}, {"data": ["TR - Open home page-7", 130, 0, 0.0, 407.9999999999999, 301, 786, 372.0, 546.1000000000001, 613.0, 737.6399999999996, 0.3368163599478712, 2.012804142744069, 0.34694716452442825], "isController": false}, {"data": ["TR - Open home page-6", 130, 0, 0.0, 580.4538461538465, 411, 1111, 533.5, 785.5000000000001, 974.5999999999999, 1098.6, 0.3365408262853918, 3.2559111454555336, 0.3561538350768737], "isController": false}, {"data": ["TR - Open home page-5", 130, 0, 0.0, 459.35384615384635, 336, 2229, 411.5, 569.8000000000002, 709.3999999999992, 1944.1099999999979, 0.33657132205215307, 3.2986770724379157, 0.34687173946531763], "isController": false}, {"data": ["TR - Open home page-4", 130, 0, 0.0, 436.0307692307692, 328, 1144, 407.5, 543.7, 627.25, 1051.3099999999993, 0.3361648759422314, 3.141060761801327, 0.3462760851014313], "isController": false}, {"data": ["TR - Open home page-3", 130, 0, 0.0, 447.1384615384615, 327, 884, 417.0, 563.7, 661.6499999999999, 861.3699999999999, 0.33610577507284445, 3.1403570445185025, 0.34624045491916655], "isController": false}, {"data": ["TR - Open home page-2", 130, 0, 0.0, 281.75384615384615, 231, 695, 272.0, 313.70000000000005, 352.1999999999998, 620.5999999999995, 0.33635970824676387, 0.7822030865531151, 0.34323749615126875], "isController": false}, {"data": ["TR - Open home page-1", 129, 0, 0.0, 1024.255813953488, 640, 1877, 997.0, 1334.0, 1532.0, 1862.8999999999994, 0.33522601769681537, 6.024039148681834, 0.23734263948260853], "isController": false}, {"data": ["TR - Login-8", 130, 0, 0.0, 468.6307692307692, 331, 1135, 420.0, 637.9, 730.4999999999999, 1049.7499999999993, 0.338610446913696, 3.216524531675705, 0.4350198005714702], "isController": false}, {"data": ["TR - Login-7", 130, 0, 0.0, 448.8923076923078, 322, 877, 417.5, 571.8, 638.8, 854.6799999999998, 0.33881872155877457, 3.217810673962563, 0.4358218699665873], "isController": false}, {"data": ["TR - Login-6", 130, 0, 0.0, 286.5769230769232, 231, 885, 275.0, 315.20000000000005, 367.9, 807.1899999999994, 0.33822898102015064, 0.8390324781126822, 0.431257195496351], "isController": false}, {"data": ["TR - Add to cart", 130, 0, 0.0, 1687.0846153846148, 1267, 2905, 1638.5, 1975.8, 2399.0, 2864.08, 0.3323405723927243, 5.025809820504135, 1.089386532058083], "isController": true}, {"data": ["TR - Search product", 130, 0, 0.0, 3405.3923076923093, 2387, 5009, 3369.0, 4008.1, 4233.45, 4989.16, 0.33675266811729354, 21.219710979594083, 2.2668625255802506], "isController": true}, {"data": ["TR - Login-4", 130, 130, 100.0, 939.8461538461537, 644, 1562, 924.0, 1196.2, 1275.25, 1511.4699999999996, 0.3383900961027873, 5.169724697694002, 0.5470012862077402], "isController": false}, {"data": ["TR - Login-3", 130, 0, 0.0, 979.0384615384615, 608, 1720, 942.5, 1309.4, 1483.6999999999998, 1706.6699999999998, 0.33565364674777437, 7.980447852333052, 0.38518474828558447], "isController": false}, {"data": ["TR - Login user", 130, 130, 100.0, 4846.707692307692, 3784, 6575, 4728.0, 5650.3, 6057.949999999999, 6537.179999999999, 0.33312150222422665, 33.165476164355745, 2.931529277536336], "isController": true}, {"data": ["TR - Login-2", 130, 0, 0.0, 730.876923076923, 450, 1583, 696.5, 976.9000000000001, 1307.1499999999996, 1543.0099999999998, 0.3385963358667285, 5.166542087361762, 0.38810892806911534], "isController": false}, {"data": ["TR - Login-1", 130, 0, 0.0, 992.8461538461543, 624, 3335, 909.0, 1392.0000000000002, 1560.9999999999995, 3099.3999999999983, 0.33786681290235393, 8.031344395601755, 0.3526789427107834], "isController": false}, {"data": ["TR - Open home page", 130, 0, 0.0, 4206.7615384615365, 3371, 6909, 4114.0, 4904.200000000001, 5090.65, 6553.119999999997, 0.33288095664865697, 25.169811298107703, 2.650189526092746], "isController": true}, {"data": ["TR - Add to cart-2", 130, 0, 0.0, 1143.9538461538464, 829, 2284, 1092.5, 1422.6000000000004, 1683.3999999999999, 2223.8599999999997, 0.3314398768063473, 1.7714082075667723, 0.6713076681483728], "isController": false}, {"data": ["TR - Add to cart-1", 130, 0, 0.0, 543.130769230769, 382, 1036, 504.0, 714.0, 779.9999999999998, 1014.2999999999998, 0.3327514449091588, 3.2536052339242656, 0.41676918504051885], "isController": false}, {"data": ["TR - Search product-3", 130, 0, 0.0, 950.0538461538463, 581, 2209, 912.0, 1364.1000000000001, 1437.85, 2201.87, 0.33653037186606094, 7.3553955890252265, 0.39888152189388937], "isController": false}, {"data": ["TR - Search product-4", 130, 0, 0.0, 399.16153846153856, 284, 807, 370.5, 513.8, 618.5499999999995, 768.2499999999998, 0.33482286582617543, 1.9072402828931272, 0.4113602742328049], "isController": false}, {"data": ["TR - Search product-1", 130, 0, 0.0, 952.9384615384614, 563, 1609, 933.5, 1336.0, 1410.3499999999997, 1593.1899999999998, 0.33722438391699094, 8.03360084306096, 0.3950277642671855], "isController": false}, {"data": ["TR - Search product-2", 130, 0, 0.0, 696.6615384615382, 343, 1582, 703.5, 1017.6000000000001, 1127.6999999999998, 1478.1499999999992, 0.3384015472759977, 2.4690246665443216, 0.42969268584101894], "isController": false}, {"data": ["TR - Search product-5", 130, 0, 0.0, 294.01538461538456, 231, 2157, 266.0, 318.5, 397.39999999999895, 1692.9299999999967, 0.3352675693101225, 0.8310716876208898, 0.4035400548033527], "isController": false}, {"data": ["TR - Search product-6", 130, 0, 0.0, 112.5538461538462, 41, 355, 135.0, 151.9, 160.34999999999997, 303.2299999999996, 0.33375266360298833, 0.6215265854856101, 0.2245660011938076], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 130, 100.0, 4.349280695884912], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2989, 130, "422/Unprocessable Entity", 130, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TR - Login-4", 130, 130, "422/Unprocessable Entity", 130, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
