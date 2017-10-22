var app = angular.module('myApp', ['chart.js']);

app.controller('MainController', ['$http','$scope',
function ($http,$scope,$route,$rootScope, $moment){
    $scope.jsonData = [];
    $scope.hashMap = [];
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

    
    $scope.generateData = function(){
        var data = $scope.jsonData;
        var years = {};
        var yearMetric = {};
        var newSchoolThisYear = 0;
        var peoplecount =0;
        var Schoolcount = 0;
        var schoolnames ={};

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
        
      
        for(var i=0;i< years[2017].length; i++)
        {
            var schoolname = years[2017][i].company_name;
            var peoplename = years[2017][i].first_name;
            //new Date(years[2017][i].company_name);
           // console.log(years[2017].length);
           if(schoolname!= "")
            Schoolcount++;
            

            if(peoplename!= "")
                peoplecount++;

            if(!schoolnames[schoolname] && schoolname!= ""){
               // schoolnames[schoolname] = [];
                 schoolnames[schoolname]= 3;
                 console.log(schoolname);
                console.log(schoolnames[schoolname]);

            }else if(schoolname!= ""){
                var scount = schoolnames[schoolname];
                schoolnames[schoolname] = ++scount;
               

            }
           // console.log(schoolname);
           // var year = schoolname.
          //  if(!years[year]){
            //    years[year] = [];
              //  years[year].push(data[i]);
            //}else{
              //  years[year].push(data[i]);
            //} 
        }
        
    

        for(year in years){
            console.log(year);
            for(var i = 0; i < years[year].length; i ++){
                console.log(years[year][i].last_name)
                
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
        });

    }; 


}]);