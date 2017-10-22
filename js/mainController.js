var app = angular.module('myApp', ['chart.js']);



app.controller('MainController', ['$http','$scope',
function ($http,$scope,$route,$rootScope, $moment){
    $scope.animationOption = {
        onComplete: function () {
            var chartInstance = this.chart,
                ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.font = "30px Verdana";
            
            this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function (bar, index) {
                    var data = dataset.data[index];                            
                    ctx.fillText(data, bar._model.x + 18, bar._model.y );
                });
            });
        }
    }
    $scope.jsonData = [];
    $scope.hashMap = [];
    var countyData = [];
    var countyMap = [];
    $scope.schoolList = [];
    $scope.metricMap = {};
    $scope.showStatisticArea = true;
    $scope.countyTitle = '';
    $scope.toggleYear = '2017';
    $scope.tickMax = 1;

    $scope.failedChart = {
        type: 'horizontalBar',
        labels: ['Total Teachers','Total Schools'],
        colors: [ '#c4c4c4']
    };

    function generateDataForChart(map,year){
        
    }

    $scope.hoverOver = function(element){
        $scope['element' + element.target.id] = {'fill':'blue'};
    }
    function getCountyFilter(){
    	var countyFilteredMap = {};
    	for(var m=0; m<countyData.length; m++){
    		var countyValue = countyData[m].county;
    		if(!countyFilteredMap[countyValue]){
                countyFilteredMap[countyValue] = [];
                countyFilteredMap[countyValue].push(countyData[m]);
            }else{
                countyFilteredMap[countyValue].push(countyData[m]);
            }
    	}
    	return countyFilteredMap;
    }

    $scope.getCountyData = function(id){
        $scope.showStatisticArea = false;        
        var county = (id.target.id).replace("_",' ');
        computeYearlyMetric(countyMap[county],county);

        var choseTime = $scope.metricMap[$scope.toggleYear];
        console.log($scope.metricMap);
        $scope.dataSet = [(choseTime['teachers']).unique().length, (choseTime['schools']).unique().length];
        $scope.countyTitle = county;
        $scope.tickMax = $scope.dataSet[0] + 2;
        $scope.showStatisticArea = true;
    }

    function computeYearlyMetric(map,county){
        var metricMap = {'county':county };
        var keys = {};

        for(var i = 0; i < map.length; i ++){
            var date = new Date(map[i].created_date);

            var school = map[i].school;
            var name = map[i].first_name +' '+ map[i].middle_name +' '+ map[i].last_name;
            if(!metricMap[date.getFullYear()]){
                metricMap[date.getFullYear()] = {};
                metricMap[date.getFullYear()]['teachers'] = [name];
                metricMap[date.getFullYear()]['schools'] = [school];
            }else{
                metricMap[date.getFullYear()]['teachers'].push(name);
                metricMap[date.getFullYear()]['schools'].push(school);
                
            }
        }
        $scope.metricMap = metricMap;
    }

    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === v) return true;
        }
        return false;
    };
    
    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    }

    $scope.generateData = function(){
        var data = $scope.jsonData;
        var countyArray = ['Maricopa','Pima', 'Pinal', 'Yavapai', 'Mohave', 'Yuma', 'Cochise', 'Coconino', 'Navajo', 'Apache', 'Gila', 'Santa Cruz', 'Graham','La Paz', 'Greenlee']
        countyData = data;
        for(var j=0 ; j<data.length ; j++)
        	countyData[j].county = countyArray[Math.floor(Math.random() * countyArray.length)]; 
        countyMap = getCountyFilter();
        var years = {};
        var yearMetric = {};
        var newSchoolThisYear = 0;

        for(var i = 0 ; i < data.length ; i ++){
            var date = new Date(data[i].created_date);
            var year = date.getFullYear();
            if(!years[year]){
                years[year] = [];
                years[year].push(data[i]);
            }else{
                years[year].push(data[i]);
            }
        }
        
    }

    $scope.hoverLeave = function(element){
        $scope['element' + element.target.id] = {'fill':'#b9b9b9'};
    }

    function getRandomBtwn(min, max) {
        var rand =  Math.random() * (max - min) + min;
        return Math.round(rand);
      }

    $scope.loadJson = function(){
        $http.get('contact.json').then(function(response) {
            $scope.jsonData =  response.data.results;
            $scope.generateData();
        });

        //create mock data 
        $http.get('https://code.org/schools.json').then(function(response) {
            var qualify = ['Y','N'];
            var schools = response.data.schools;
            var schoolNames = []
            var randYears = ['2016-10-22T05:35:11.000Z','2015-10-22T05:35:11.000Z','2017-10-22T05:35:11.000Z']
            
            for(var i = 0; i < schools.length; i ++){
                if(schools[i].state === "AZ"){
                    schoolNames.push(schools[i].name);
                }
            }
            for(var i = 0; i < $scope.jsonData.length; i ++){
                $scope.jsonData[i]['created_date'] = randYears[getRandomBtwn(0,2)];
                $scope.jsonData[i]['school'] = schoolNames[getRandomBtwn(0,schoolNames.length)];
                $scope.jsonData[i]['highly_qualify'] = qualify[getRandomBtwn(0,qualify.length)];
                $scope.jsonData[i]['reduce_lunch'] = getRandomBtwn(0,100) + '%';
            }

            console.log($scope.jsonData);
        }); 


    }; 


}]);