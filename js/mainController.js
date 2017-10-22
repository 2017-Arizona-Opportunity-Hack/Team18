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
                    ctx.fillText(data, bar._model.x + 20, bar._model.y +14);
                });
            });
        }
    }
    $scope.jsonData = [];
    $scope.hashMap = [];
    $scope.newTeachNSchool = [];
    var countyData = [];
    var countyMap = [];
    $scope.schoolList = [];
    $scope.metricMap = {};
    $scope.countyTitle = ''
    $scope.toggleYear = new Date().getFullYear().toString();
    $scope.tickMax = 1;

    $scope.failedChart = {
        type: 'horizontalBar',
        labels: ['Teachers','Schools'],
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
        var county = (id.target.id).replace("_",' ');
        computeYearlyMetric(countyMap[county],county);

        var choseTime = $scope.metricMap[$scope.toggleYear];
        //console.log($scope.metricMap);
        var previousYears = JSON.parse(JSON.stringify($scope.metricMap))
        var thisYear = new Date().getFullYear().toString();
        delete previousYears[thisYear];
        $scope.newTeachNSchool = getNewDatas($scope.metricMap[thisYear], previousYears);
        $scope.dataSet = [(choseTime['teachers']).unique().length, (choseTime['schools']).unique().length],
        

        $scope.countyTitle = county;
        $scope.tickMax = $scope.dataSet[0] + ($scope.dataSet[0]/10);
        $scope.showDropdown = true;
        $scope.statisticArea = true;
        $scope.showStatisticArea2 = true;
    }

    function getNewDatas(thisYear, lastYear){
        var newThisYear = [0,0];
        var lastYearTeachers = [];
        var lastyearsSchools = [];
        for(year in lastYear){
            if(parseInt(year)){
                lastYearTeachers = Array.prototype.concat.apply(lastYearTeachers,lastYear[year]['teachers']);
                lastyearsSchools = Array.prototype.concat.apply(lastyearsSchools,lastYear[year]['teachers']);
            }
        }
        for(var i = 0; i < thisYear['teachers'].length ; i++){
            if(lastYearTeachers.indexOf(thisYear['teachers'][i]) !== -1)newThisYear[0] +=1;
       
        }
        for(var i = 0; i < thisYear['schools'].length ; i++){
            if(lastYearTeachers.indexOf(thisYear['schools'][i]) !== -1)newThisYear[1] +=1;
        }
        return newThisYear;
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
                metricMap[date.getFullYear()]['highly_qualify'] = [map[i].highly_qualify];
            }else{
                metricMap[date.getFullYear()]['teachers'].push(name);
                metricMap[date.getFullYear()]['schools'].push(school);
                metricMap[date.getFullYear()]['highly_qualify'].push(map[i].highly_qualify);
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
                $scope.jsonData[i]['school'] = schoolNames[getRandomBtwn(0,schoolNames.length-1)];
                $scope.jsonData[i]['highly_qualify'] = qualify[getRandomBtwn(0,qualify.length-1)];
                $scope.jsonData[i]['reduce_lunch'] = getRandomBtwn(0,100) + '%';
            }

            console.log($scope.jsonData);
        }); 
    }; 


}]);