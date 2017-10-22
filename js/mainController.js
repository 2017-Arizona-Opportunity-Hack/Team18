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
    $scope.countyTitle = '';
    $scope.subjectSpecial = '';
    $scope.gradLevel = '';
    $scope.highly_Qualify_Total_Count = 0;
    $scope.highly_Qualify_Count = 0;
    $scope.toggleCompareTo = 'Compare?'
    $scope.toggleYear = new Date().getFullYear().toString();
    $scope.tickMax = 1;
    $scope.schoolCompare = ['Total Schools',''];
    $scope.teachersCompare = ['Total Teachers',''];
    $scope.teacherSet = [0,0];
    $scope.schoolSet = [0,0];
    $scope.failedChart = {
        type: 'horizontalBar',
        labels: ['Teachers','Schools'],
        colors: [ '#f9214a']
    };
    $scope.compareYears = ['2017','2016','2015']

    $scope.togglingCompare = function(year){
        console.log($scope.teacherSet); 
        
        $scope.toggleCompareTo = "Comparing to " + year;
        $scope.teacherSet[1] = 5;
        $scope.teachersCompare[1] = ('Total Teachers in ' + year);

        $scope.schoolSet[1] = 9;
        $scope.schoolCompare[1] = ('Total Schools in ' + year);
    }

    $scope.hoverOver = function(element){
        $scope['element' + element.target.id] = {'fill':'#f9214a'};
        if(element.target.id != $scope.currentActive){
            $scope['element' + element.target.id] = {'fill':'#f2b0bc'};
        }
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
    $scope.togglingYear = function(year){
        $scope.toggleYear = year;
        $scope.simpleComputation();
    }
    $scope.getCountyData = function(id){
        var county = (id.target.id).replace("_",' ');
        var thisYear = new Date().getFullYear().toString();
        $scope.countyTitle = county;

        if(!$scope.currentActive){
            $scope.currentActive = id.target.id;
            $scope['element' + $scope.currentActive] = {'fill':'#f92148'};                 
        }else{
            $scope['element' + $scope.currentActive] = {'fill':'#b9b9b9'};                             
            $scope['element' + id.target.id] = {'fill':'#f92148'};
            $scope.currentActive = id.target.id;      
        }
        
        var index = $scope.compareYears.indexOf(thisYear);
        if (index > -1) {
            $scope.compareYears.splice(index, 1);
        }

        $scope.countyTitle = county;        
        computeYearlyMetric(countyMap[county],county);
        $scope.simpleComputation();
    }
    	$scope.simpleComputation = function(){
        var choseTime = $scope.metricMap[$scope.toggleYear];
        //console.log($scope.metricMap);
        var previousYears = JSON.parse(JSON.stringify($scope.metricMap))
        var thisYear = new Date().getFullYear().toString();
        delete previousYears[thisYear];
        $scope.newTeachNSchool = getNewDatas($scope.metricMap[thisYear], previousYears);
        console.log($scope.newTeachNSchool);
        $scope.dataSet = [(choseTime['teachers']).unique().length, (choseTime['schools']).unique().length];
        var highlyQualifyTotalCount = $scope.metricMap[thisYear]['highly_qualify'].length;
        var highlyQualifyCount = 0;
        for(var i=0;i<highlyQualifyTotalCount;i++)
        {
        	if ($scope.metricMap[thisYear]['highly_qualify'][i]=='Y') {
        		highlyQualifyCount++;
        	}
        }
        $scope.highly_Qualify_Total_Count = highlyQualifyTotalCount;
    	$scope.highly_Qualify_Count = highlyQualifyCount;
        var modeGradMap = {};
        var modeSplMap = {};
	    var maxGradEl = $scope.metricMap[thisYear]['graduate_level'][0], maxGradCount = 1, maxSplCount = 1;
	    var maxSplEl = $scope.metricMap[thisYear]['specialization'][0];
	    for(var i = 0; i < $scope.metricMap[thisYear]['graduate_level'].length; i++)
	    {
	        var el = $scope.metricMap[thisYear]['graduate_level'][i];
	        if(modeGradMap[el] == null)
	            modeGradMap[el] = 1;
	        else
	            modeGradMap[el]++;  
	        if(modeGradMap[el] > maxGradCount)
	        {
	            maxGradEl = el;
	            maxGradCount = modeGradMap[el];
	        }
	    }
	    for(var i = 0; i < $scope.metricMap[thisYear]['specialization'].length; i++)
	    {
	        var el = $scope.metricMap[thisYear]['specialization'][i];
	        if(modeSplMap[el] == null)
	            modeSplMap[el] = 1;
	        else
	            modeSplMap[el]++;  
	        if(modeSplMap[el] > maxGradCount)
	        {
	            modeSplEl = el;
	            modeSplCount = modeSplMap[el];
	        }
	    }
	    $scope.subjectSpecial = maxSplEl;
        $scope.gradLevel = maxGradEl;
        $scope.tickMax = $scope.dataSet[0] + ($scope.dataSet[0]/10);
        $scope.schoolSet = [(choseTime['schools']).unique().length];
        $scope.teacherSet = [(choseTime['teachers']).unique().length];

        $scope.teachersCompare[1] = ('');
        $scope.schoolCompare[1] = ('');
        $scope.toggleCompareTo = 'Compare?'
        $scope.tickMax = $scope.teacherSet[0] + ($scope.teacherSet/3);
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
            if(lastYearTeachers.indexOf(thisYear['teachers'][i]) === -1)newThisYear[0] +=1;
        }
        for(var i = 0; i < thisYear['schools'].length ; i++){
            if(lastYearTeachers.indexOf(thisYear['schools'][i]) === -1)newThisYear[1] +=1;
        }
        return newThisYear;
    }

    function computeYearlyMetric(map,county){
        var metricMap = {'county':county };
        var keys = {};
        console.log(map);
        for(var i = 0; i < map.length; i ++){
            var date = new Date(map[i].created_date);
            var school = map[i].school;
            var name = map[i].first_name +' '+ map[i].middle_name +' '+ map[i].last_name;
            var specialization = map[i].subject_spl;
            var graduate_status = map[i].graduate_level;
            var lowReducedLunch = map[i].reduce_lunch;
            if(!metricMap[date.getFullYear()]){
                metricMap[date.getFullYear()] = {};
                metricMap[date.getFullYear()]['teachers'] = [name];
                metricMap[date.getFullYear()]['schools'] = [school];
                metricMap[date.getFullYear()]['highly_qualify'] = [map[i].highly_qualify];
                metricMap[date.getFullYear()]['specialization'] = [specialization];
                metricMap[date.getFullYear()]['graduate_level'] = [graduate_status];
                metricMap[date.getFullYear()]['reduce_lunch'] = [lowReducedLunch];
            }else{
                metricMap[date.getFullYear()]['teachers'].push(name);
                metricMap[date.getFullYear()]['schools'].push(school);
                metricMap[date.getFullYear()]['highly_qualify'].push(map[i].highly_qualify);
                metricMap[date.getFullYear()]['specialization'].push(specialization);
                metricMap[date.getFullYear()]['graduate_level'].push(graduate_status);
                metricMap[date.getFullYear()]['reduce_lunch'].push(lowReducedLunch);
            }
        }
        $scope.metricMap = metricMap;
        console.log($scope.metricMap);
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
        if(element.target.id !== $scope.currentActive){
            console.log(1);
            $scope['element' + element.target.id] = {'fill':'#b9b9b9'};
        }
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
            var subject_special = ['Social Studies','Visual Arts','English','Finance','Economics','Photography','Mathematics','Marketing','History'];
            var graduate_level = ['Elementary school','Middle school', 'High school', 'College'];
            for(var i = 0; i < $scope.jsonData.length; i ++){
                $scope.jsonData[i]['created_date'] = randYears[getRandomBtwn(0,2)];
                $scope.jsonData[i]['school'] = schoolNames[getRandomBtwn(0,schoolNames.length-1)];
                $scope.jsonData[i]['highly_qualify'] = qualify[getRandomBtwn(0,qualify.length-1)];
                $scope.jsonData[i]['reduce_lunch'] = getRandomBtwn(0,100) + '%';
             	$scope.jsonData[i]['subject_spl'] = subject_special[getRandomBtwn(0,subject_special.length-1)];
             	$scope.jsonData[i]['graduate_level'] = graduate_level[getRandomBtwn(0,graduate_level.length-1)];   
            }
            //console.log($scope.jsonData);
        }); 
    }; 


}]);