'use strict';


var app =  angular.module('myApp', ['wu.masonry', 'infinite-scroll', 'ngSanitize' ,'ui.bootstrap','ui-notification', 'ngRoute', 'myApp.view1', 'myApp.view2', 'myApp.version'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view2'});
}]);



app.filter('unique', function() {
  return function(collection, keyname) {
    var output = [],
        keys = [];

    angular.forEach(collection, function(item) {
      var key = item[keyname];
      if(keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});

app.config(function(NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 3000,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'right',
    positionY: 'top'
  });
});
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});

app.service('anchorSmoothScroll', function(){

  this.scrollTo = function(eID) {

    // This scrolling function
    // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
      for ( var i=startY; i<stopY; i+=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY += step; if (leapY > stopY) leapY = stopY; timer++;
      } return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
      setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
      leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }

    function currentYPosition() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) return self.pageYOffset;
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) return document.body.scrollTop;
      return 0;
    }

    function elmYPosition(eID) {
      var elm = document.getElementById(eID);
      var y = elm.offsetTop;
      var node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
      } return y;
    }

  };

})
/*MODAL CONTROLLER*/
app.controller('modal', ['$scope','$rootScope','$uibModal',function($scope,$rootScope,$uibModal){


  $scope.showModal = false;

  $rootScope.$watch('showModal',function(val,oldVal){

    if(val===true){
      $scope.open('lrg');
    }

  })




}])
/*MODAL INSTANCE CONTROLLER*/
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, $rootScope,Notification) {

  $scope.created_at ='last_day';
  $scope.currentSearchString ="";
  $scope.newTagList = [];
  $scope.addTagString = "";
  $scope.addTag = function(){


    $scope.newTagList.push($scope.addTagString );

    $scope.addTagString = "";

  }

  $scope.removeTag = function(item) {
    var index = $scope.newTagList.indexOf(item);
    $scope.newTagList.splice(index, 1);
  }


  $scope.ok = function (data) {

    var currentSobj ={}
    if($scope.currentSearchString!=""){
      currentSobj.q =$scope.currentSearchString
    }
    if($scope.newTagList.length!=0){
      currentSobj.tags = $scope.newTagList.toString();
    }
    currentSobj.limit=200;
    //last_year, last_two_weeks, last_week, last_day, last_hour

    if($scope.created_at!="all_time"){
      currentSobj.created_at = $scope.created_at;
    }

    $uibModalInstance.close(currentSobj);
    $rootScope.currentSearchObject = currentSobj;
    console.log("searchCalled!!"+currentSobj)
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
/*DEMO CONTROLLER*/
app.controller('DemoCtrl', ['$scope', '$rootScope', 'SoundcloudWall','SoundcloudService', '$sce', '$window','$location', 'anchorSmoothScroll','$uibModal', '$compile',  'Notification',  function ($scope, $rootScope, SoundcloudWall, SoundcloudService, $sce,  $window, $location, anchorSmoothScroll, $uibModal,$compile, Notification) {


      $scope.scService = new SoundcloudService($scope, Notification);
      $scope.currentMessage = "Lizard Balls";
      $scope.$watch("currentMessage", function (olVal, newVal) {

          Notification(newVal);


      })

      $scope.getRandowSong = function(){

        var defaultSongArray =[257270824,257270824,253342519,255631552,256281214,257633383,257849145,257863641,257715302,257683154,257644515,257406676,251897038,257451349,257451349,256943159,250791638];
        var index = Math.floor(Math.random()*defaultSongArray.length);

        return defaultSongArray[index];

      }
      $scope.firstRun = true;
      $scope.isExpanded = false;
      $scope.radioModel = 'tracks';
      $scope.getBrickImgHgt = function(item){

        var str ={};
        var add = Math.floor((item.gravity *200)+300);

        str = {'height': add+'px','width':'300px',
          'background-image':'url('+item.artwork_url+')',
          'background-size':'cover',
          'background-position': 'center center'

        };
        return str;
      }
      $scope.getFrameImgHgt = function(grav){

        var str ={};
        var add = Math.floor((grav*200)+300);

        str = {'height': add+'px','min-width': '300px'};
        return str;
      }

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.animationsEnabled = true;

      $scope.open = function (size) {

        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'searchWindow.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      };




      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
      $scope.currentStreamFilter = "track";
      $scope.hidePhoto = false;
      $scope.bricks = {};
      $scope.loadingApplicaiton = true;
      $scope.startupSong =  $scope.getRandowSong();
      $scope.currentTime = 0;

      $scope.currentSong = {};
      $scope.currentSong.title = "Death, Taxes, and the Eternal Soul";
      $scope.currentSong.tag_list = "Classical Progressive Rock Space Rock";
      $scope.currentSong.description = "So about the song. Many of you may know, or guess that I struggle, keeping my mind in the 'real world'. I am a daze, in most moments of my day, I have a family and must remain in the game, for my survival and my childrens' depends on it, so I work as an software engineer. I make all kinds of junk. I drive in a car, I sit in a cube, I swipe a card I open the door, rinse wash repeat. Drone. ";
      $scope.currentSong.permalink_url = "https://soundcloud.com/chris-pendergraft/the-royal-chamber-psyche-orchestra-death-taxes-and-the-eternal-soul"
      $scope.currentSong.user = {};
      $scope.currentSong.user.username = "The Royal Chamber-Pysche Orchestra";
      $scope.currentSong.artwork_url = 'https://i1.sndcdn.com/artworks-000081108459-s5qr9b-large.jpg';

      $rootScope.currentSong = {};
      $rootScope.currentSong.title = "Death, Taxes, and the Eternal Soul";
      $rootScope.currentSong.tag_list = "Classical Progressive Rock Space Rock Woosh";
      $rootScope.currentSong.description = "So about the song. Many of you may know, or guess that I struggle, keeping my mind in the 'real world'. I am a daze, in most moments of my day, I have a family and must remain in the game, for my survival and my childrens' depends on it, so I work as an software engineer. I make all kinds of junk. I drive in a car, I sit in a cube, I swipe a card I open the door, rinse wash repeat. Drone. ";
      $rootScope.currentSong.permalink_url = "https://soundcloud.com/chris-pendergraft/the-royal-chamber-psyche-orchestra-death-taxes-and-the-eternal-soul"

      $rootScope.currentSong.user = {};
      $rootScope.currentSong.user.username = "The Royal Chamber-Pysche Orchestra";
      $rootScope.currentSong.artwork_url = 'https://i1.sndcdn.com/artworks-000081108459-s5qr9b-large.jpg';

      $rootScope.currenSongURL = "";
      $rootScope.currenSongURL = "https://soundcloud.com/chris-pendergraft/the-royal-chamber-psyche-orchestra-death-taxes-and-the-eternal-soul"
      $scope.currenSongURL = "https://soundcloud.com/chris-pendergraft/the-royal-chamber-psyche-orchestra-death-taxes-and-the-eternal-soul"
      $scope.$watch('currentTime', function (value) {
        if (value) {
          console.log("from cntrl: " + value);
        }
      });
      $scope.gotoElement = function (eID){
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(eID);


        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);

      };
      $rootScope.$watch('currentSearchObject',function(newD, oldD){
        if(newD!== oldD){
          $scope.scService.searchByTag(newD);
        }
      });
      $rootScope.currentSearchObject = {

        tags:'shoegaze,garage',
        limit:200
      };




      //SC INIT
      $scope.scService.initialize();

      $scope.scService.connect().then(function () {
        $scope.currentUser =  $scope.scService.getMe();
      }).then(function (){

        $scope.getUserList();



        })

      });

      $scope.getUserList = function () {

        $scope.scService.getUserList().then(function (data) {


          data.collection.forEach(function (entry) {
            if ($scope.currentUser.followings.length < $scope.currentUser.followings_count) {
              $scope.currentUser.followings.push(entry.id);
            }

          })

          if ($scope.currentUser.followings.length < $scope.currentUser.followings_count) {


            var str = "";
            var str2 = "";
            var arr = [];
            var arr2 = [];
            var arr3 = [];
            $scope.next_href = "";
            var obj = {};
            if(data.next_href!=null){
              arr = data.next_href.split("?");
              arr2 = arr[1].toString().split("&");
              arr3 = arr2[2].split("=");
              str = arr3[1];
              obj = {'page_size': '200', 'cursor': str};
              $scope.getUserList(obj);
              console.log("user list called: "+$scope.currentUser.followings.length)
            }else{
              obj ={};
              $scope.getEventList();
              console.log("user list called: "+$scope.currentUser.followings.length)
              Notification.success("Got users you follow...");

            }



            //calls next page of pagination, above parse given url into an object



          } else {
            this.getEventList();


          }


        }).catch(function (error) {
          scope.currentSong.user.youFollow = false;

        })


      }


      $scope.getEventList = function () {

        $scope.


      }






      $scope.getForDup = function (arr, value) {
        var match = false;
        arr.forEach(function (entry) {
          if (entry.id == value) {
            match = true;
          }

        })
        return match;
      }




      $scope.updateFilter = function (value) {

        $scope.currentStreamFilter = value;
        if(value!="search"){
          $scope.changeFilter();
        }



      }













      $scope.removeItem = function(item, array) {
        var index = array.indexOf(item);
        array.splice(index, 1);
      }

     /* $scope.checkIfUserFollowsYou = function () {
        var str = '/users/'+$scope.currentSong.user.id +'/followings/'+$scope.currentUser.id;

        SC.get(str).then(function(data){

          if(data){
            $scope.currentSong.user.followsYou  = true;
            console.log("Mega Balls"+data);
          }

        }).catch(function(error){
          console.log("Lizard Balls"+error);
        })


      }*/









      $scope.likeCurrentTrack = function () {
        $scope.scService.likeCurrentTrack();
      }
      $scope.commentCurrentTrack = function () {
        $scope.scService.commentCurrentTrack();
      }
      $scope.repostCurrentTrack = function () {
        $scope.scService.repostCurrentTrack();
      }
      $scope.followCurrentUser = function () {
        $scope.scService.followCurrentUser();
      }
      $scope.searchByArtist = function () {
        $scope.scService.searchByArtist();
      }

      $scope.searchByTag = function () {
        $scope.scService.searchByTag();
      }


      $scope.play = function (song) {
        console.log(song.permalink_url);
        $scope.currentSong = song;
        $scope.currentSong.comment = "Say something nice...."
        $scope.currenSongURL = song.permalink_url;


        $scope.scService.getFullUser();


      }
      $scope.playSongReady = function (song) {

        var str = "<div plangular='{{currenSongURL}}' class='p2 mb3 flex flex-center bg-darken-2 rounded'> <img ng-src='{{ track.artwork_url }}' class='img' /> <button ng-click='playPause()' title='Play/Pause' class='flex-none h2 mr2 button button-transparent button-grow rounded'> <svg ng-if='player.playing !== track.src' class='icon geomicon' data-icon='play' viewBox='0 0 32 32' width='32' height='32' style='fill:currentcolor'><path d='M4 4 L28 16 L4 28 z '></path></svg>  <svg ng-if='player.playing === track.src' class='icon geomicon' data-icon='pause' viewBox='0 0 32 32' width='32' height='32' style='fill:currentcolor'><path d='M4 4 H12 V28 H4 z M20 4 H28 V28 H20 z '></path></svg>  </button>  <h2 class='h4 caps flex-auto m0'>{{track.user.username}} - {{track.title}}</h2>  <samp class='h6'>{{ currentTime | hhmmss }} / {{ duration | hhmmss }}</samp>  </div>";

        /* var str1 = "<div plangular data-src='"+ $scope.currenSongURL+" class='media'> <img ng-src='{{ track.artwork_url }}' class='img' /> <div class='bd'> <div class='media'> <a href='' ng-click='playPause()' ng-hide='player.playing == track' class='img'>Play</a> <a href='' ng-click='playPause()' ng-show='player.playing == track' class='img'>Pause</a> <div class='bd'>  <p>{{ track.user.username }}</p>  <h1><a ng-href='{{ track.permalink_url }}'>{{ track.title }}</a></h1>  </div>  </div>  <div ng-click='seekTo($event)'>  <progress value='{{ currentTime / duration }}'>{{ currentTime / duration }}</progress>  <img ng-src='{{ track.waveform_url }}' />  </div>  <small>{{ currentTime | hhmmss }} | {{ duration | hhmmss }}</small>  </div>  </div>";


         var str2 = "<div plangular data-src='"+ $scope.currenSongURL+"' class='media'> <img ng-src='{{ track.artwork_url }}' class='img' style='z-index: 0; width: 200px; top: 10px; position: absolute;' />  <div class='bd' style='z-index: 100; top: 30px; left: 200px; position: absolute;'>  <div class='media'>  <div class='bd'>  <h2>{{ track.user.username }}</h2>  <h3><a ng-href='{{ track.permalink_url }}'>{{ track.title }}</a></h3>  <button ng-click='playPause()' >Play/Pause</button>  <small>{{ currentTime | hhmmss }} | {{ duration | hhmmss }}</small>  <div ng-click='seekTo($event)'>  <img ng-src='{{ track.waveform_url }}' /> <progress style='z-index: 100; top: 100px; position: absolute;' value='{{ currentTime / duration }}'>{{ currentTime / duration }}</progress>  </div>  </div>  </div>  </div>  </div>";
         */
        var str12 = "<div class='mb2'> <div plangular data-src='{{currentSongURL}}' class='relative overflow-hidden white bg-black ng-scope'>  <div class='absolute left-0 right-0' style='top:50%;margin-top:-50%;'>  <img style='min-width:100%;-webkit-filter:blur(32px);brightness(80%);' ng-src='{{currentSong.artwork_url}}' src='{{currentSong.artwork_url}}'>  </div>  <div class='relative flex flex-center bg-darken-1' style='width: 45%; float: left;'  >  <div class='clearfix'>  <img class='left' alt='SRCD Party artwork' ng-src='{{currentSong.artwork_url}}' src='{{currentSong.artwork_url}}'>  </div>  <div class='flex-auto px2'>  <h3 class='h4 regular m0'><span class='inline-block px1 bg-black ng-binding'>{{currentSong.user.username}}</span></h3>  <h2 class='h4 caps m0'><span class='inline-block px1 bg-white ng-binding'><a href='{{currentSong.permalink_url}}' > {{currentSong.title}}</a></span></h2> <small > <small>{{ currentTime | hhmmss }} | {{ duration | hhmmss }}</small></small> <div class='flex flex-center py1'>  <button ng-click='playPause()' title='Play/Pause' class='flex-none h4 mr2 button button-small bg-black button-grow rounded'>  <svg ng-if='player.playing !== track.src' class='icon geomicon ng-scope' data-icon='play' viewBox='0 0 32 32' width='32' height='32' style='fill:currentcolor'><path d='M4 4 L28 16 L4 28 z '></path></svg></button>  <div class='flex-auto'>  <progress class='progress ng-binding' ng-click='seek($event)' ng-value='currentTime / duration || 0' value='0'>NaN  </progress>  </div>  </div>  </div>  </div> <div class='right' style=' padding:5px; width: 50%; z-index: 1000; position: relative; height:128px; top:5px; background-color: rgba(0, 0, 0, 0.6); float:right;' > <h6> Tags: {{currentSong.tag_list}}</h6> <h6>  {{currentSong.description | limitTo:300 }}... <a href='{{currentSong.permalink_url}}'>more on sc</a></h6> <p> <a href=''> <span class='inline-block px1 bg-black ng-binding' ng-click='likeCurrentTrack(brick)'>like</span></a>| <a href=''> <span class='inline-block px1 bg-black ng-binding' ng-click='repostCurrentTrack(brick)'>repost</span></a>| <a href=''> <span class='inline-block px1 bg-black ng-binding' ng-click='currentSong.showComment=true;'>comment</span></a> <input  ng-show='currentSong.showComment' type='text' ng-model='currentSong.comment'  class='form-control'> <button ng-show='currentSong.showComment'  ng-click='currentSong.showComment = false;commentCurrentTrack()' >send</button> </p></div> </div> </div>"
        var strFinalTemp = "<div class='mb2' ><div plangular data-src='{{currentSongURL}}' style='width: 100%' class='relative overflow-hidden white bg-black ng-scope'><div class='absolute left-0 right-0' style='top:50%; margin-top:-50%;'><img style='min-width:100%;-webkit-filter:blur(32px);brightness(30%);' ng-src='{{currentSong.artwork_url}}' src='{{currentSong.artwork_url}}'></div><div class='relative flex flex-center bg-darken-1' style='width: 45%; float: left;'  ><div class='clearfix' style='padding-left: 14px;'><img class='left' alt='SRCD Party artwork' style='width: 120px;' ng-src='{{currentSong.artwork_url}}' src='{{currentSong.artwork_url}}'></div><div class='flex-auto px2'><h3 class='h3 regular m0'><span class='inline-block px1 bg-black ng-binding'>{{currentSong.user.username}}</span></h3><h2 class='h2 caps m0'><span class='inline-block px1 bg-white ng-binding' ><a href='{{currentSong.permalink_url}}' > {{currentSong.title}}</a> </span></h2><small > <small><span class='inline-block px1 bg-black ng-binding'>{{ currentTime | hhmmss }} | {{ duration | hhmmss }}</span></small></small><div class='flex flex-center py1'>" +
            " <button ng-click='playPause()' title='Play/Pause' class='flex-none h4 mr2 button button-small bg-black button-grow rounded'><!-- ngIf: player.playing !== track.src --><svg ng-if='player.playing !== track.src' class='icon geomicon ng-scope' data-icon='play' viewBox='0 0 32 32' width='32' height='32' style='fill:currentcolor'><path d='M4 4 L28 16 L4 28 z '></path></svg><!-- end ngIf: player.playing !== track.src --><!-- ngIf: player.playing === track.src --></button>" +
            "<div class='flex-auto'><progress class='progress ng-binding' ng-click='seek($event)' ng-value='currentTime / duration || 0' value='0'>NaN</progress></div></div></div></div><div class='right' style=' padding:5px; width: 50%; z-index: 1000; position: relative; height:128px; top:5px; background-color: rgba(0, 0, 0, 0.8); float:right;' ><h3> Tags:{{currentSong.genre}} {{currentSong.tag_list}}</h2><h4>  {{currentSong.description | limitTo:300 }}... <a href='{{currentSong.permalink_url}}'>more on sc</a></h3><div style='width: 100%' ><div style='width: 20%;float: left;' ><p> <a href=''> <span class='inline-block px1 bg-black ng-binding' ng-click='likeCurrentTrack()'>like</span></a>| <a href=''> <span class='inline-block px1 bg-black ng-binding' ng-click='repostCurrentTrack()'>repost</span></a>| <a href=''> <span class='inline-block px1 bg-black ng-binding' ng-click='currentSong.showComment = !currentSong.showComment'>comment</span></a> </p></div><div style='width: 80%;float: right;' ><span style='display: block;'>    <input  ng-show='currentSong.showComment'   style='width: 80%' type='text' ng-model='currentSong.comment'  class='form-control'> <button style=' position: absolute; top: 90px; right: 10px;' ng-show='currentSong.showComment'  ng-click='commentCurrentTrack();currentSong.showComment=false;' >send</button></span></div></div></div></div></div>";


        var strFinalTempEmbedPlaylist = "<div class='mb2'   ><div class='left' style='width: 100%;  height:305px' id='putTheWidgetHere'></div></div>";



        var strFinalTempEmbed="";
        strFinalTempEmbed += "<div ng-style=\" { 'height':(isExpanded?350:106)+ 'px' }\" style=\" overflow:hidden; border-top: 9px solid #FF851B;\" >";
        strFinalTempEmbed += "    <div class=\"left\" style=\"width: 50%; height:305px;\"";
        strFinalTempEmbed += "         id=\"putTheWidgetHere\"><\/div>";
        strFinalTempEmbed += "    <div class=\"right\"";
        strFinalTempEmbed += "         style=\"border-top: 3px solid #ff6120;color: #000; padding-left:5px; padding-right: 5px; padding-top: 0px; width: 50%; z-index: 1000; position: relative; height:128px; top:0px;  float:right;\">";
        strFinalTempEmbed += "        <div style=\"padding-top: 10px; padding-left: 10px; padding-right: 15px;\">";
        strFinalTempEmbed += "            <div id=\"pod\" style=\"z-index: 1000; width: 350px; height: 65px; position: absolute; display: inline-block; padding-right: 15px; text-align: right; top: 0; right: 0\">";
        strFinalTempEmbed += "                <span style=\"display: inline-block;height: 128px;\"  >";

        strFinalTempEmbed += "                        <h2><span style=\"color:#a4a4a4;\">Followers: <\/span> {{currentSong.user.followers_count}} <span style=\"color:#a4a4a4;\"> | Following: <\/span>{{currentSong.user.followings_count}}<span style=\"color:#a4a4a4;\"> | Tracks: <\/span>  {{currentSong.user.track_count}}<\/h2>";


        strFinalTempEmbed += "                     <button ng-click=\"isExpanded = !isExpanded;currentSong.showComment=false;\" class=\"btn btn-sml btn-success\" style=\"display: inline; font-size: 9px;\" >{{isExpanded?'collpase':'detail'}}<\/button><span style=\"display: inline;\" >";
        strFinalTempEmbed += "                    <\/span>";
        strFinalTempEmbed += "            <\/div>";
        strFinalTempEmbed += "    <div class=\"left\" style=\"height: 128px\"; >";
        strFinalTempEmbed += "            <span style=\"display: inline-block\">";
        strFinalTempEmbed += "                <h1><span style=\"display: inline-block; position: relative; top:-15px;\">";
        strFinalTempEmbed += "                    <img class=\"img-square\" style=\"width: 60px; border: 2px solid #FF851B;\"  ng-src=\"{{currentSong.user.avatar_url}}\">";
        strFinalTempEmbed += "                {{currentSong.user.username}} <button ng-click='followCurrentUser()' ng-class=\" currentSong.user.youFollow ?  'btn btn-success' : 'btn btn-warning'   \" style=\"font-size:10px; \">{{currentSong.user.youFollow ? 'Following':'Follow'}} <\/button><p>{{currentSong.user.full_name}}   {{currentSong.user.city}} {{currentSong.user.country}} <\/p>";

        strFinalTempEmbed += "                 <\/span><\/h1>";
        strFinalTempEmbed += "";
        strFinalTempEmbed += "    <\/div>";
        strFinalTempEmbed += "    <div class=\"left\" style=\"position: absolute;top:120px; left: 20px;\" >";

        strFinalTempEmbed += "                <h4>{{currentSong.user.description | limitTo:500}}<\/h4> ";
        strFinalTempEmbed += "";
        strFinalTempEmbed += "                <p>{{currentSong.description | limitTo:900}}...more on sc<\/p>";

        strFinalTempEmbed += "    <\/div>";

        strFinalTempEmbed += "                <div  style=\"min-width:100%;font-size:10px;padding-left:15px; position: relative;bottom:45px; right:15px;\" class=\"right\" >";

        strFinalTempEmbed += "              <p><button class=\"btn btn-warning\"  style=\"font-size:10px;\" ";
        strFinalTempEmbed += "                                     ng-click=\"likeCurrentTrack()\">Like<\/button>  <button  style=\"font-size:10px;\" class=\"btn btn-warning\"";
        strFinalTempEmbed += "              ng-click=\"repostCurrentTrack()\">Repost<\/button>";
        strFinalTempEmbed += "              <button class=\"btn btn-warning\"  style=\"font-size:10px;\" ng-click=\"searchByArtist(currentSong.user.id)\">Explore Artist<\/button>";
        strFinalTempEmbed += "              <button class=\"btn btn-warning\"  style=\"font-size:10px;\" ";
        strFinalTempEmbed += "              ng-click=\"currentSong.showComment = !currentSong.showComment;\">Comment<\/button> <\/p>";
        strFinalTempEmbed += "";
        strFinalTempEmbed += "               <p>";
        strFinalTempEmbed += "              <\/div> ";



        strFinalTempEmbed += "        <\/span> <\/div>";
        strFinalTempEmbed += "         <\/div>";
        strFinalTempEmbed += "            <div style=\"width: 100%;position: absolute;bottom: 0px;\"><span style=\"float: right;display: inline\">    <input";
        strFinalTempEmbed += "                ng-show=\"currentSong.showComment\" style=\"width: 450px;\" type=\"text\" ng-model=\"currentSong.comment\" > ";
        strFinalTempEmbed += "               <button   style=\"float:right;\" ng-show=\"currentSong.showComment\"";
        strFinalTempEmbed += "                ng-click=\"commentCurrentTrack();currentSong.showComment=false;\">send";
        strFinalTempEmbed += "            <\/button><\/span>";
        strFinalTempEmbed += "             <\/div>";
        strFinalTempEmbed += "            <div ng-show=\"isExpanded\" ng-hide=\"!isExpanded\"  style=\"width:800px;position:absolute;bottom:45px; right:15px;\" >";
        strFinalTempEmbed += "                <div  style=\"display: block; \" class=\"right\" ng-repeat=\"tag in currentSong.tag_list_converted\">";
        strFinalTempEmbed += "                    <div class=\"badge\" style=\"font-size: 10px;\">{{tag}}<\/div>";
        strFinalTempEmbed += "                <\/div>";

        strFinalTempEmbed += "             <\/div>";


        strFinalTempEmbed += "    <\/div><\/div>";
        strFinalTempEmbed += "";




        var curEmb =  strFinalTempEmbedPlaylist;
        if($scope.currentStreamFilter != "playlist" && $scope.currentStreamFilter != "playlist-repost" ){
          curEmb =  strFinalTempEmbed;
        }
        document.getElementById('foot').src = "<div>WINDOWS SUCKS!!</div>";
        $compile(document.getElementById('foot'))($scope);

        document.getElementById('foot').innerHTML = curEmb;
        $compile(document.getElementById('foot'))($scope);

        SC.oEmbed( $scope.currenSongURL, {element: document.getElementById('putTheWidgetHere'), maxheight:350,auto_play:true });


        if($scope.firstRun){
          $scope.bricks = new SoundcloudWall();
          $scope.bricks.nextRef  = $scope.firstRunObj;
          $scope.bricks.items = $scope.eventList;
          $scope.firstRun = false;
          $scope.$apply();
        }else{
          $scope.$apply();
        }



      }



      function genBrick() {
        return {
          src: 'http://lorempixel.com/g/400/200/?' + ~~(Math.random() * 10000)
        };
      }
      ;


      $scope.remove = function remove() {
        $scope.bricks.splice(
            ~~(Math.random() * $scope.bricks.length),
            1
        )
      };
      console.log($scope.bricks);
    }])
    .factory('SoundcloudWall', function () {
      var SoundcloudWall = function () {
        this.items = [];
        this.busy = false;
        this.nextRef = "";

        this.after = '';
      };

      SoundcloudWall.prototype.nextPage = function (value) {
        if (this.busy) return;




        this.busy = true;
        if(this.nextRef!=""){

          var calculateGravity = function(data){
            var playRepostRatio,playCommentRatio,playLikeRatio;
            var grav = 1;
            var sliceCoef2 =.50;
            var sliceCoef1 =.25;
            if(data.playback_count!=0) {

              if (data.reposts_count != 0) {

                if(data.reposts_count>data.playback_count){
                  data.reposts_count = data.playback_count;
                }
                playRepostRatio = ((data.reposts_count / data.playback_count) * sliceCoef2);
              } else {
                playRepostRatio = .001;
              }
              if (data.comment_count != 0) {
                playCommentRatio = ((data.comment_count / data.playback_count) * sliceCoef1);
              } else {
                playCommentRatio = .001;
              }
              if (data.likes_count != 0) {
                if(data.likes_count>data.playback_count){
                  data.likes_count = data.playback_count;
                }
                playLikeRatio =  ((data.likes_count / data.playback_count) * sliceCoef1);
              } else {
                playLikeRatio = .001;
              }

              grav = (grav * (playRepostRatio + playCommentRatio + playLikeRatio + .1)).toPrecision(2);
              if(grav>1){
                grav=1
              }
            }else{
              grav =.001;
            }
            return grav;
          }

          SC.get('me/activities', this.nextRef).then(function (data) {


            var str = "";
            var str2 = "";
            var arr = [];
            var arr2 = [];
            var arr3 = [];


            arr = data.next_href.split("?");
            arr2 = arr[1].toString().split("&");
            arr3 = arr2[1].split("=");
            str = arr3[1];
            var obj = {'limit': '50', 'cursor': str};

            this.nextRef = obj;


            var i = 0;
            for (i = 0; i < data.collection.length; i++) {

              var getForDup = function (value, arr) {
                var match = false;
                arr.forEach(function (entry) {
                  if (entry.id === value) {
                    match = true;
                  }

                })
                return match;
              }

              var curFil = value;
              if (data.collection[i].type === curFil) {
                var art = data.collection[i].origin.artwork_url;
                if (art === null) {
                  art = data.collection[i].origin.user.avatar_url;
                }
                var updateArt = art.replace("large", "crop");
                data.collection[i].origin.showComment = false;
                data.collection[i].origin.gravity =  calculateGravity(data.collection[i].origin );
                data.collection[i].origin.artwork_url = updateArt;
                if(data.collection[i].origin.tag_list !=null){
                  var str= data.collection[i].origin.tag_list;
                  var ar =  str.split('"');
                  ar.shift();
                  ar.pop();
                  ar.unshift(data.collection[i].origin.genre);
                  data.collection[i].origin.tag_list_converted = ar;
                }else{
                  data.collection[i].origin.tag_list_converted = [data.collection[i].origin.genre];
                }

                var isDupe = getForDup( data.collection[i].origin.id, this.items );

                if(!isDupe) {
                  this.items.push(data.collection[i].origin);
                }


              }


            }





          }.bind(this));
        }
        this.busy = false;
      };

      return SoundcloudWall;
    })



/*SC SERVICE*/
    .factory('SoundcloudService', function ( ) {

      var SoundcloudService = function ( ) {
        this.oauth_token  = "007";
        this.Notification = angular.element('[ng-controller=DemoCtrl]').Notification;
      };


      SoundcloudService.prototype.likeCurrentTrack  = function () {



          SC.put('/me/favorites/' + $scope.currentSong.id+ '?format=json&oauth_token='+$scope.auth + '&').then(function () {
            Notification.success("You Love : " + $scope.currentSong.title + " by " + $scope.currentSong.user.username)
          }).catch(function(error){
            Notification.error("Like Call Fails!! Thanks Obama!")
          });
          $scope.currentSong.liked = true;



      }
      SoundcloudService.prototype.initialize = function () {

        SC.initialize({
          client_id: 'b80e5aceaabda253df92e81cfe94c570',
          redirect_uri: 'http://offplanet.earth/gravity/callback.html',

        });
      };

      SoundcloudService.prototype.connect = function () {
        SC.connect().then(function (data) {
         return this.oauth_token = data.oauth_token;

        });
      };

      SoundcloudService.prototype.getMe = function () {

        return SC.get('/me')
      };

      SoundcloudService.prototype.getUserList = function (inbound) {


        ///  /users/{id}/followings/{id}
        var objIn = {'page_size': '300'}
        if (inbound != null) {
          objIn = inbound;
        }

          return  SC.get('/me/followings', objIn)
      };
      SoundcloudService.prototype.getEventList  = function (value) {



        //kick off


        scope.eventList = [];
        Notification("Filtering new releases from stream data")

        SC.get('/me/activities', {'limit': '300'}).then(function (val) {
          var hold = [];
          var rPhold = [];
          var str = "";
          var str2 = "";
          var arr = [];
          var arr2 = [];
          var arr3 = [];
          scope.next_href = "";

          arr = val.next_href.split("?");
          arr2 = arr[1].toString().split("&");
          arr3 = arr2[1].split("=");
          str = arr3[1];
          var obj = {'limit': '100', 'cursor': str};

          var getForDup = function (value, arr) {
            var match = false;
            arr.forEach(function (entry) {
              if (entry.id === value) {
                match = true;
              }

            })
            return match;
          }

          var i = 0;
          for (i = 0; i < val.collection.length; i++) {
            if (val.collection[i].origin!=null) {
              if (val.collection[i].type === scope.currentStreamFilter) {
                var art = val.collection[i].origin.artwork_url;
                if (art == null) {
                  art = val.collection[i].origin.user.avatar_url;
                }
                var updateArt = art.replace("large", "crop");
                val.collection[i].origin.gravity = scope.calculateGravity(val.collection[i].origin );

                val.collection[i].origin.showComment = false;
                val.collection[i].origin.artwork_url = updateArt;
                if (val.collection[i].origin.tag_list != null) {
                  var str = val.collection[i].origin.tag_list;
                  var ar = str.split('"');
                  ar.shift();
                  ar.pop();
                  ar.push(val.collection[i].origin.genre);
                  val.collection[i].origin.tag_list_converted = ar;
                } else {
                  val.collection[i].origin.tag_list_converted = [val.collection[i].origin.genre];
                }
                if (val.collection[i].origin.genre != "") {
                  val.collection[i].origin.genreTag = val.collection[i].origin.genre;

                } else {
                  val.collection[i].origin.genreTag = 'unknown genre';
                }


                scope.eventList.push(val.collection[i].origin);



              }
            }

          }
          //playlist-repost
          //track-repost
          //playlist


          scope.title = "we got the junk"

          scope.firstRunObj = obj;
          Notification.success(" Found : "+scope.eventList.length+" New Releases" );

          scope.$apply();


        }).then(function () {


          return SC.get('/tracks/' + scope.startupSong);


        }).then(function (song) {


          if (song.tag_list != null) {
            var str = song.tag_list;
            var ar = str.split('"');
            ar.push(song.genre);
            var clean = [];
            ar.forEach(function (entry) {
              if (entry !== " " || entry !== " ") {
                clean.push(entry);
              }
            })

            song.tag_list_converted = clean;
          } else {
            song.tag_list_converted = [song.genre];
          }
          scope.currentSong = song;
          scope.loadingApplicaiton = false;

          scope.play(scope.currentSong);
          $cope.hidePhoto = true;




          scope.$apply();


        }).catch(function(error){

          Notification.warning("SC API FAIL, retrying.")


        })
      };
      SoundcloudService.prototype.repostCurrentTrack  = function (value) {



          $scope.currentSong.reposted = true;

          SC.put( '/e1/me/track_reposts/' + $scope.currentSong.id+ '?format=json&oauth_token='+$scope.auth + '&').then(function () {
            Notification.success("You Reposted : " + $scope.currentSong.title + " by " + $scope.currentSong.user.username)
          }).catch(function(error){
            Notification.error("repost Call Fails!! Thanks Obama!")
          });



      };
      SoundcloudService.prototype.getFullUser = function (value) {



          SC.get('/users/'+scope.currentSong.user.id).then(function(data){

            scope.currentSong.user = data;

            scope.lookUpFollowing();


          }).then(function(){

            scope.playSongReady();

          });



      };
      SoundcloudService.prototype.lookUpFollowing  = function (value) {
        var match = false;
        var cd =-1;
        cd =  scope.currentUser.followings.indexOf(scope.currentSong.user.id);
        if(cd !== -1){
          match = true;

        }

        scope.currentSong.user.youFollow = match;
      };
      SoundcloudService.prototype.followCurrentUser = function (value) {
        if(scope.currentSong.user.youFollow){
          //unfollow
          SC.delete( '/me/followings/' + scope.currentSong.user.id+ '?format=json&oauth_token='+scope.auth + '&').then(function () {
            Notification.success("You Unfollowed : " + scope.currentSong.user.username + ", if this was a mistake, just click it again and follow")
            scope.currentSong.user.youFollow = false;
            scope.removeItem(scope.currentSong.user.id, scope.currentUser.followings);

          }).catch(function(error){
            console.log(error +"unfollow still went through, but with errors")
          });

        }else{

          //Follow
          SC.put( '/me/followings/' + scope.currentSong.user.id+ '?format=json&oauth_token='+scope.auth + '&').then(function () {
            Notification.success("You Followed : " + scope.currentSong.user.username  );
            scope.currentSong.user.youFollow = true;
            scope.currentUser.followings.push(scope.currentSong.user.id);
          }).catch(function(error){
            var msg = "May be a mistake, could be snakes in my code...."

            if(scope.currentUser.followings.length>=2000){
              msg = "Oh you are at 2k followings- can't add this awesome artist!"
            }

            Notification.error("Could not follow??? "+msg);
          });

        }
      };
      SoundcloudService.prototype.commentCurrentTrack = function (value) {

        var cur = Audio.currentTime;
        var rand = Math.floor(Math.random() * scope.currentSong.duration);

        if (scope.currentSong.comment !== "Say something nice....") {
          SC.post('/tracks/' + scope.currentSong.id + '/comments', {
            comment: {body: scope.currentSong.comment, timestamp: rand}
          }).then(function () {
            Notification.success("You Commented '" + scope.currentSong.comment + "' on " + scope.currentSong.title + "' by " + scope.currentSong.user.username)
          }).catch(function(error){
            Notification.error("Comment Call Fails!! Thanks Obama!")
          });

        }


      };
      SoundcloudService.prototype.searchByArtist = function (artistId) {


          Notification("Exploring Artist: "+scope.currentSong.user.username );
          SC.get('/users/'+artistId+'/tracks',{'limit':100}).then(function(val){
            scope.currentStreamFilter="";
            scope.$apply();
            scope.bricks = new SoundcloudWall();
            scope.currentSearchResults = {};
            scope.currentSearchResults = val;



            //LEAVE EMPTY BECAUSE USERS/{ID}/TRACKS HAS NO PAGINATION
            scope.next_href = "";
            var obj = {};



            var i = 0;
            for (i = 0; i < val.length; i++) {


              var art = val[i].artwork_url;
              if (art == null) {
                art = val[i].user.avatar_url;
              }
              var updateArt = art.replace("large", "crop");
              if(val[i].tag_list !=null){
                var str= val[i].tag_list;
                var ar =  str.split('"');
                ar.shift();
                ar.pop();
                ar.push(val[i].genre);
                val[i].tag_list_converted = ar;
              }else{
                val[i].tag_list_converted = [val[i].genre];
              }
              val[i].showComment = false;
              val[i].artwork_url = updateArt;
              val[i].gravity =  .001;
              scope.bricks.items.push(val[i]);
            }

            scope.bricks.busy = false;
            scope.bricks.nextRef = obj;
            scope.$apply();
            Notification.success("Exploring Artist: Found "+scope.bricks.items.length+" tracks" );





          })
        };
      SoundcloudService.prototype.searchByTag = function (value) {
        Notification("Searching");
          SC.get('/tracks', $rootScope.currentSearchObject ).then(function(val){
            scope.bricks.items = [];
            scope.bricks = new SoundcloudWall();
            scope.currentSearchResults = {};
            scope.currentSearchResults = val;

            scope.currentStreamFilter="search";
            scope.radioModel = 'search';

            //LEAVE EMPTY BECAUSE USERS/{ID}/TRACKS HAS NO PAGINATION
            scope.next_href = "";
            var obj = {};



            var i = 0;
            for (i = 0; i < val.length; i++) {


              var art = val[i].artwork_url;
              if (art == null) {
                art = val[i].user.avatar_url;
              }
              if(val[i].tag_list !=null){
                var str= val[i].tag_list;
                var ar =  str.split('"');
                ar.shift();
                ar.pop();
                ar.push(val[i].genre);
                val[i].tag_list_converted = ar;
              }else{
                val[i].tag_list_converted = [val[i].genre];
              }
              var updateArt = art.replace("large", "crop");
              val[i].showComment = false;
              val[i].artwork_url = updateArt;
              val[i].gravity =  this.calculateGravity( val[i]);
              scope.bricks.items.push(val[i]);
            }

            scope.bricks.busy = false;
            scope.bricks.nextRef = obj;
            Notification.success("Found "+scope.bricks.items.length+" that matched your query");
            scope.$apply();

          })

      };
      SoundcloudService.prototype.getReleaseDate = function (value) {


          var str = "";
          var strAr= value.split(" ");
          var str1 = strAr[0];
          var str2 = str1.replace("/", "-" );
          var str3 = str2.replace("/", "-" );
          var newDate = new Date(str3);
          var newDateMil = newDate.getTime();

          var now = new Date() ;
          var nowDateMil = now.getTime();
          var days = Math.floor(((nowDateMil-newDateMil)/(86400000 )));
          if(days <=1 ){
            str = "Released Today";
          }else if(days >=2 && days <=31){
            str = "Released "+days+ " days ago";
          }else if(days>31){
            var dis =  Math.floor((days/31));
            if(dis ==1){
              str = "Released "+dis+  " month ago";
            }else{
              str = "Released "+dis+  " months ago";
            }


          }




          return str;
      };
      SoundcloudService.prototype.changeFilter = function () {

        //$scope.hidePhoto = true;
        Notification("Loading : " +scope.currentStreamFilter);
        scope.bricks = new SoundcloudWall();
        scope.eventList = [];
        var limit =   {'limit': '200'};


        SC.get('/me/activities/all/own',limit).then(function (val) {
          var dupeCount =0;
          var hold = [];
          var rPhold = [];
          var str = "";
          var str2 = "";
          var arr = [];
          var arr2 = [];
          var arr3 = [];
          scope.next_href = "";

          arr = val.next_href.split("?");
          arr2 = arr[1].toString().split("&");
          arr3 = arr2[1].split("=");
          str = arr3[1];
          var obj = {'limit': '200', 'cursor': str};

          scope.title = "we got the junk"
          scope.bricks.busy = false;
          scope.bricks.nextRef = obj;

          var i = 0;
          for (i = 0; i < val.collection.length; i++) {

            if (val.collection[i].type === scope.currentStreamFilter) {
              var art = val.collection[i].origin.artwork_url;
              if (art == null) {
                art = val.collection[i].origin.user.avatar_url;
              }
              var updateArt = art.replace("large", "crop");

              val.collection[i].origin.showComment = false;
              val.collection[i].origin.artwork_url = updateArt;
              if(scope.currentStreamFilter==="track" ||  scope.currentStreamFilter==="track-repost"){
                val.collection[i].origin.gravity = scope.calculateGravity( val.collection[i].origin );
              }else{
                val.collection[i].origin.gravity = .001;
              }

              if(val.collection[i].origin.tag_list !=null){
                var str= val.collection[i].origin.tag_list;
                var ar =  str.split('"');
                ar.shift();
                ar.pop();
                ar.push(val.collection[i].origin.genre);
                val.collection[i].origin.tag_list_converted = ar;
              }else{
                val.collection[i].origin.tag_list_converted = [val.collection[i].origin.genre];
              }



              scope.bricks.items.push(val.collection[i].origin);



            }
          }




          Notification.success( scope.bricks.items.length +' Tracks Found')

          scope.$apply();
          //track-repost
          //playlist
















        })
      }
      SoundcloudService.prototype.calculateGravity = function (data) {


          var playRepostRatio,playCommentRatio,playLikeRatio;
          var grav = 1;
          var sliceCoef2 =.50;
          var sliceCoef1 =.25;
          if(data.playback_count!=0) {

            if (data.reposts_count != 0) {

              if(data.reposts_count>data.playback_count){
                data.reposts_count = data.playback_count;
              }
              playRepostRatio = ((data.reposts_count / data.playback_count) * sliceCoef2);
            } else {
              playRepostRatio = .001;
            }
            if (data.comment_count != 0) {
              playCommentRatio = ((data.comment_count / data.playback_count) * sliceCoef1);
            } else {
              playCommentRatio = .001;
            }
            if (data.likes_count != 0) {
              if(data.likes_count>data.playback_count){
                data.likes_count = data.playback_count;
              }
              playLikeRatio =  ((data.likes_count / data.playback_count) * sliceCoef1);
            } else {
              playLikeRatio = .001;
            }

            grav = (grav * (playRepostRatio + playCommentRatio + playLikeRatio + .1)).toPrecision(2);
            if(grav>1){
              grav=1
            }
          }else{
            grav =.001;
          }
          return grav;
        }





      return SoundcloudService;
    });
