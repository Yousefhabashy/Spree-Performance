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

    var data = {"OkPercent": 93.3288859239493, "KoPercent": 6.6711140760507};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6368452030606239, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 500, 1500, "TR - Open home page-8"], "isController": false}, {"data": [0.965, 500, 1500, "TR - Open home page-7"], "isController": false}, {"data": [0.525, 500, 1500, "TR - Open home page-6"], "isController": false}, {"data": [0.935, 500, 1500, "TR - Open home page-5"], "isController": false}, {"data": [0.945, 500, 1500, "TR - Open home page-4"], "isController": false}, {"data": [0.925, 500, 1500, "TR - Open home page-3"], "isController": false}, {"data": [0.98, 500, 1500, "TR - Open home page-2"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Open home page"], "isController": true}, {"data": [0.47474747474747475, 500, 1500, "TR - Open home page-1"], "isController": false}, {"data": [0.96, 500, 1500, "TR - Login-8"], "isController": false}, {"data": [0.92, 500, 1500, "TR - Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Login-4"], "isController": false}, {"data": [0.5, 500, 1500, "TR - Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Login user"], "isController": true}, {"data": [0.5, 500, 1500, "TR - Login-2"], "isController": false}, {"data": [0.495, 500, 1500, "TR - Login-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1499, 100, 6.6711140760507, 618.5323549032688, 230, 1999, 490.0, 1060.0, 1184.0, 1452.0, 4.621223098100027, 53.94357380912561, 5.164684420982943], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR - Open home page-8", 100, 0, 0.0, 545.7799999999997, 452, 1006, 509.0, 674.8, 832.55, 1005.6499999999999, 0.3375459062432491, 3.7732391126677607, 0.35568899870382376], "isController": false}, {"data": ["TR - Open home page-7", 100, 0, 0.0, 412.74, 321, 806, 394.0, 490.9, 588.6999999999997, 804.7799999999994, 0.33784354465447053, 2.0187504486984578, 0.34809102560854066], "isController": false}, {"data": ["TR - Open home page-6", 100, 0, 0.0, 610.42, 466, 1140, 576.0, 776.4000000000001, 847.8499999999999, 1138.4999999999993, 0.3376678631364617, 3.2670717748920306, 0.3569122933050593], "isController": false}, {"data": ["TR - Open home page-5", 100, 0, 0.0, 454.53999999999996, 352, 1999, 422.0, 521.0, 618.1999999999998, 1987.5899999999942, 0.3377591034522358, 3.3095741353789148, 0.3487032900269869], "isController": false}, {"data": ["TR - Open home page-4", 100, 0, 0.0, 441.2999999999999, 348, 1239, 406.0, 504.6, 619.1999999999998, 1235.3999999999983, 0.3377431328377516, 3.156443753736283, 0.3479347957329532], "isController": false}, {"data": ["TR - Open home page-3", 100, 0, 0.0, 448.81000000000023, 348, 868, 416.5, 599.8000000000001, 685.0999999999998, 867.8, 0.3377123366316572, 3.1552951711357267, 0.3480020093884029], "isController": false}, {"data": ["TR - Open home page-2", 100, 0, 0.0, 298.5700000000001, 241, 1537, 276.5, 309.9, 370.54999999999967, 1528.4299999999957, 0.3380296925281917, 0.7862128304662782, 0.34448658782687475], "isController": false}, {"data": ["TR - Open home page", 100, 0, 0.0, 4320.909999999999, 3632, 5825, 4198.5, 4915.3, 5305.599999999998, 5824.38, 0.3316155647081452, 25.073060997159715, 2.6400679376662226], "isController": true}, {"data": ["TR - Open home page-1", 99, 0, 0.0, 1094.888888888889, 753, 1785, 1065.0, 1389.0, 1525.0, 1785.0, 0.335415847890607, 6.026384802655206, 0.23747704074286138], "isController": false}, {"data": ["TR - Login-8", 100, 0, 0.0, 439.36999999999983, 353, 1084, 418.0, 487.30000000000007, 559.3999999999999, 1081.5699999999988, 0.3326967735066906, 3.1598071003313657, 0.4273659003273736], "isController": false}, {"data": ["TR - Login-7", 100, 0, 0.0, 455.1, 358, 921, 423.5, 598.4000000000001, 621.8, 920.1599999999996, 0.33222922487599543, 3.1554022185021777, 0.426551178250946], "isController": false}, {"data": ["TR - Login-6", 100, 0, 0.0, 283.38000000000005, 230, 423, 279.0, 312.5, 332.95, 422.6499999999998, 0.3336747938723961, 0.8270279659101147, 0.4252333325269526], "isController": false}, {"data": ["TR - Login-4", 100, 100, 100.0, 1015.3300000000003, 712, 1916, 1005.0, 1202.1000000000001, 1279.2999999999997, 1911.1099999999974, 0.3346328241337193, 5.109944529380762, 0.5406869070724648], "isController": false}, {"data": ["TR - Login-3", 100, 0, 0.0, 1015.06, 710, 1470, 987.5, 1305.0000000000005, 1380.95, 1469.99, 0.334704506126766, 7.955762680698595, 0.3840799579778492], "isController": false}, {"data": ["TR - Login user", 100, 100, 100.0, 4975.699999999997, 3984, 6388, 4938.0, 5523.8, 5709.399999999999, 6383.109999999998, 0.33268349157978083, 33.1181672528827, 2.927179378364262], "isController": true}, {"data": ["TR - Login-2", 100, 0, 0.0, 771.5099999999999, 523, 1297, 767.5, 938.5, 1050.7499999999998, 1296.92, 0.3370521419663622, 5.143030578002292, 0.38703065489231187], "isController": false}, {"data": ["TR - Login-1", 100, 0, 0.0, 995.9500000000004, 687, 1502, 974.0, 1242.7, 1302.5, 1501.5299999999997, 0.3357236859774931, 7.98221094610292, 0.35058863902653564], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 100, 100.0, 6.6711140760507], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1499, 100, "422/Unprocessable Entity", 100, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TR - Login-4", 100, 100, "422/Unprocessable Entity", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
