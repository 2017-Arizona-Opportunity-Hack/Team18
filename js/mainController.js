var app = angular.module('myApp', ['chart.js']);

app.controller('MainController', ['$http','$scope',
function ($http,$scope,$route,$rootScope, $moment){
    $scope.jsonData = [];
    $scope.hashMap = [];
    var countyData = [];
    var countyMap = [];
    $scope.years = [2017,2016,2015,2014,2013]

    $scope.failedChart = {
        type: 'horizontalBar',
        labels: ['Total Teachers', 'Total School', 'Total County', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        colors: [ '#c4c4c4','#d63131'],
        data :  [
                    [1,2,3,4,5,6,7,8]
                ],
        options: {
            title: {
                display: true,
                text: '',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                            gridLines: {
                                display:false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false
                            }   
                        }]
                }
        }
    };
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
    	var county = id.target.id;
    	console.log(countyMap[county]);
    }

    
    $scope.generateData = function(){
        var data = $scope.jsonData;
        var countyArray = ['Maricopa','Pima', 'Pinal', 'Yavapai', 'Mohave', 'Yuma', 'Cochise', 'Coconino', 'Navajo', 'Apache', 'Gila', 'Santa Cruz', 'Graham','La Paz', 'Greenlee']
        countyData = data;
        for(var j=0 ; j<data.length ; j++)
        	countyData[j].county = countyArray[Math.floor(Math.random() * countyArray.length)]; 
        countyMap = getCountyFilter();
        console.log(countyMap);
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
        for(year in years){
            //console.log(year);
            for(var i = 0; i < years[year].length; i ++){
                //console.log(years[year][i].last_name);                
            }
        }
        
        // for(var year in years){
        //     var curYear = years[year];
        //     for(var i = 0; i < curYear.length; i ++){                         
        //          //console.log(curYear[i].company_name);
                
        //         if(curYear[i].company_name){
        //             var school = curYear[i].company_name;
        //             if(!schools[school]){
        //                 schools[school] = 1;
        //             }else{
        //                 schools[school] += 1;
        //             }
        //         }
        //     }
        // }
        
        // console.log(years);
        // console.log('number of registered people in 2017 is ' + years['2017'].length);
    }

    $scope.hoverLeave = function(element){
        $scope['element' + element.target.id] = {'fill':'#b9b9b9'};
    }

    $scope.loadJson = function(){
        $http.get('contact.json').then(function(response) {
            $scope.jsonData =  response.data.results;
            $scope.generateData();
        });



    }; 


}]);