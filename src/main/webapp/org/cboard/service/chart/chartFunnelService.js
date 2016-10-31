/**
 * Created by yfyuan on 2016/10/28.
 */
'use strict';
cBoard.service('chartFunnelService', function (dataService) {

    this.render = function (containerDom, option, scope) {
        new CBoardEChartRender(containerDom, option).chart();
    };

    this.parseOption = function (chartData, chartConfig) {
        var echartOption = null;
        dataService.castRawData2Series(chartData, chartConfig, function (casted_keys, casted_values, aggregate_data, newValuesConfig) {
            var string_keys = _.map(casted_keys, function (key) {
                return key.join('-');
            });
            var string_values = _.map(casted_values, function (value) {
                return value.join('-');
            });

            var series = [];
            var b = 100 / (string_keys.length * 9 + 1);
            for (var i = 0; i < string_keys.length; i++) {
                var s = {
                    name: string_keys[i],
                    type: 'funnel',
                    left: b + i * b * 9 + '%',
                    width: b * 8 + '%',
                    maxSize: '100%',
                    minSize: '10%',
                    label: {
                        normal: {
                            formatter: function (params) {
                                return params.seriesName + "\n" + params.name + "\n" + params.value + "\n" + params.data.percent + "%";
                            },
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: []
                };
                var m = _.max(aggregate_data, function (d) {
                    return d[i]
                })[i];
                for (var d = 0; d < string_values.length; d++) {
                    s.data.push({
                        name: string_values[d],
                        value: aggregate_data[d][i],
                        percent: (aggregate_data[d][i] / m * 100).toFixed(2)
                    });
                }
                series.push(s);
            }

            echartOption = {
                legend: {
                    data: string_values
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return params.seriesName + " <br/>" + params.name + " : " + params.value + "<br>" + params.data.percent + "%";
                    }
                },
                toolbox: false,
                series: series
            }
            ;
        });
        return echartOption;
    };
});