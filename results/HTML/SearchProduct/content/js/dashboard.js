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

    var data = {"OkPercent": 95.23620484319174, "KoPercent": 4.763795156808257};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6288641889544981, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.675, 500, 1500, "TR - Open home page-8"], "isController": false}, {"data": [0.9208333333333333, 500, 1500, "TR - Open home page-7"], "isController": false}, {"data": [0.6041666666666666, 500, 1500, "TR - Open home page-6"], "isController": false}, {"data": [0.9208333333333333, 500, 1500, "TR - Open home page-5"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "TR - Open home page-4"], "isController": false}, {"data": [0.8916666666666667, 500, 1500, "TR - Open home page-3"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "TR - Open home page-2"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Open home page"], "isController": true}, {"data": [0.46218487394957986, 500, 1500, "TR - Open home page-1"], "isController": false}, {"data": [0.9125, 500, 1500, "TR - Login-8"], "isController": false}, {"data": [0.4875, 500, 1500, "TR - Search product-3"], "isController": false}, {"data": [0.8708333333333333, 500, 1500, "TR - Login-7"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "TR - Search product-4"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "TR - Login-6"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "TR - Search product-1"], "isController": false}, {"data": [0.5875, 500, 1500, "TR - Search product-2"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Search product"], "isController": true}, {"data": [0.0, 500, 1500, "TR - Login-4"], "isController": false}, {"data": [0.4708333333333333, 500, 1500, "TR - Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "TR - Login user"], "isController": true}, {"data": [0.5166666666666667, 500, 1500, "TR - Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Search product-5"], "isController": false}, {"data": [0.4625, 500, 1500, "TR - Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "TR - Search product-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2519, 120, 4.763795156808257, 617.1417229059158, 39, 2359, 500.0, 1100.0, 1264.0, 1597.6000000000004, 6.1668551731566765, 70.04492157854601, 6.898754667524739], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR - Open home page-8", 120, 0, 0.0, 573.1333333333332, 390, 2038, 517.5, 717.7, 909.5999999999999, 1944.7599999999966, 0.3358371861321631, 3.7543252156354603, 0.3539026467468572], "isController": false}, {"data": ["TR - Open home page-7", 120, 0, 0.0, 424.84999999999997, 329, 859, 391.5, 574.6000000000001, 636.3499999999997, 853.3299999999998, 0.3362889394567813, 2.0095946124410093, 0.3464695616473674], "isController": false}, {"data": ["TR - Open home page-6", 120, 0, 0.0, 613.5000000000002, 422, 1441, 548.5, 838.9000000000001, 1083.8999999999992, 1439.32, 0.3362333459420838, 3.2532026445102904, 0.3553708461172054], "isController": false}, {"data": ["TR - Open home page-5", 120, 0, 0.0, 450.9583333333332, 333, 1083, 420.5, 572.7000000000003, 708.5999999999999, 1046.6699999999987, 0.33681279664085373, 3.300425524375423, 0.34711891737140066], "isController": false}, {"data": ["TR - Open home page-4", 120, 0, 0.0, 453.87500000000017, 342, 1090, 415.0, 585.0, 674.8499999999999, 1028.6799999999976, 0.3366842771248285, 3.146017011849884, 0.3467563100244938], "isController": false}, {"data": ["TR - Open home page-3", 120, 0, 0.0, 448.2500000000001, 335, 728, 419.5, 573.8000000000002, 656.7499999999998, 727.16, 0.33659644890746404, 3.145021024129758, 0.3468192512131497], "isController": false}, {"data": ["TR - Open home page-2", 120, 0, 0.0, 283.9666666666665, 232, 662, 279.0, 310.0, 332.84999999999997, 602.9899999999977, 0.3366852217633327, 0.7830095967563184, 0.3434748212061187], "isController": false}, {"data": ["TR - Open home page", 120, 0, 0.0, 4327.508333333334, 3554, 5839, 4219.0, 4989.1, 5154.549999999999, 5813.589999999999, 0.33180885597836607, 25.088467780150363, 2.6412125349781834], "isController": true}, {"data": ["TR - Open home page-1", 119, 0, 0.0, 1074.9831932773109, 670, 1724, 1031.0, 1439.0, 1632.0, 1721.6, 0.3353047751344741, 6.024911370530091, 0.23739840036376342], "isController": false}, {"data": ["TR - Login-8", 120, 0, 0.0, 448.6249999999999, 332, 856, 419.5, 612.9000000000002, 684.75, 831.2199999999991, 0.3295155297923228, 3.129861212177796, 0.4232322349940001], "isController": false}, {"data": ["TR - Search product-3", 120, 0, 0.0, 983.4583333333335, 580, 1639, 948.5, 1263.0, 1391.6499999999994, 1627.4499999999996, 0.32869598086989393, 7.184125730321382, 0.38983428929081104], "isController": false}, {"data": ["TR - Login-7", 120, 0, 0.0, 467.02500000000003, 343, 1197, 429.5, 582.9, 693.1499999999996, 1130.0099999999975, 0.32740100894077584, 3.1092624772183464, 0.4207774392739337], "isController": false}, {"data": ["TR - Search product-4", 120, 0, 0.0, 389.4583333333333, 286, 1185, 360.0, 473.9, 558.95, 1094.9099999999967, 0.3308820488216463, 1.8841831616538038, 0.4061867963586431], "isController": false}, {"data": ["TR - Login-6", 120, 0, 0.0, 291.02500000000026, 235, 634, 280.0, 342.30000000000007, 422.7499999999997, 609.8499999999991, 0.329017717604093, 0.8159789339551768, 0.41918699379253244], "isController": false}, {"data": ["TR - Search product-1", 120, 0, 0.0, 997.4583333333331, 584, 2359, 932.5, 1325.8000000000002, 1490.3999999999996, 2242.8699999999953, 0.3311084683750024, 7.888282019568511, 0.3874141532314807], "isController": false}, {"data": ["TR - Search product-2", 120, 0, 0.0, 808.3333333333334, 318, 2028, 795.5, 1098.9, 1175.9499999999998, 1938.7499999999966, 0.32927050120458123, 2.4569345911009157, 0.4183621810878], "isController": false}, {"data": ["TR - Search product", 120, 0, 0.0, 3528.1750000000006, 2418, 4747, 3492.5, 4182.3, 4394.099999999999, 4718.019999999999, 0.32771752933754633, 20.782211923490248, 2.205276542388897], "isController": true}, {"data": ["TR - Login-4", 120, 120, 100.0, 1054.0833333333328, 699, 1785, 1019.0, 1343.0, 1439.6, 1755.8099999999988, 0.3300039600475206, 5.040192806532429, 0.5331465344771638], "isController": false}, {"data": ["TR - Login-3", 120, 0, 0.0, 1027.8583333333338, 637, 1765, 994.5, 1361.6000000000001, 1528.5, 1737.2799999999988, 0.3319309251744712, 7.891106688823055, 0.38127755718201706], "isController": false}, {"data": ["TR - Login user", 120, 120, 100.0, 5112.1, 4091, 6203, 5094.0, 5831.7, 5949.45, 6197.54, 0.3316355435921104, 33.01534393024046, 2.918284829332058], "isController": true}, {"data": ["TR - Login-2", 120, 0, 0.0, 776.4583333333331, 444, 1804, 750.5, 1016.9, 1142.5499999999995, 1722.099999999997, 0.33440062867318193, 5.102349996063826, 0.3835647054766463], "isController": false}, {"data": ["TR - Search product-5", 120, 0, 0.0, 281.2333333333334, 231, 420, 276.5, 321.30000000000007, 367.9999999999998, 418.53, 0.329330142490175, 0.8163705082456035, 0.395898356025095], "isController": false}, {"data": ["TR - Login-1", 120, 0, 0.0, 1047.0250000000008, 629, 2054, 964.0, 1483.9, 1552.5, 1980.2899999999972, 0.33501772802144114, 7.964446679834724, 0.35000737213490046], "isController": false}, {"data": ["TR - Search product-6", 120, 0, 0.0, 68.23333333333333, 39, 271, 46.0, 163.0, 192.39999999999986, 268.8999999999999, 0.32945039437957624, 0.6917305420076707, 0.22167121262453912], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 120, 100.0, 4.763795156808257], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2519, 120, "422/Unprocessable Entity", 120, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TR - Login-4", 120, 120, "422/Unprocessable Entity", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
