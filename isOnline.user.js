// ==UserScript==
// @name         isOnline
// @namespace    http://isonline.cf/
// @version      0.2.0
// @description  Know who is online on Scratch!
// @author       @World_Languages with help from @JuegOStrower and alpha testers
// @match        https://scratch.mit.edu/*
// @icon         https://raw.githubusercontent.com/WorldLanguages/isOnline/master/green%20cat.png
// @updateURL    https://github.com/WorldLanguages/isOnline/raw/master/isOnline.user.js
// ==/UserScript==

console.log("Running isOnline");
var l = [];
var url = (window.location.href).substring(30,100);
var user = url.substring(0, user1.indexOf('/')); // var user = profile user is on
iOlog("Possible username: " + user);
var token = readCookie('scratchcsrftoken');


if (url == 'https://scratch.mit.edu/' || url.startsWith('https://scratch.mit.edu/explore/') || url.startsWith('https://scratch.mit.edu/search/')) {
    iOlog("Added JQuery")
    var script = document.createElement('script');script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";document.getElementsByTagName('head')[0].appendChild(script);}


if (window.location.href == 'https://scratch.mit.edu/accounts/settings/') {
    iOlog("Disbaled location changing");
    document.getElementsByClassName("box-content tabs-content")[0].innerHTML = '<h4>Edit your account settings</h4> <br> <div class="field-wrapper"><label>Username</label><span>' + Scratch.INIT_DATA.LOGGED_IN_USER.model.username + '</span></div><label>Location</label> <select style="cursor:not-allowed"> <option> Not changeable</option> </select> <br>Sorry, by using isOnline you cannot use a location in your profile. <br> <button style="cursor:not-allowed" type="submit">Save my Changes</button> <br> <br> <p><a href="/accounts/settings/delete_account_confirmation/">I want to delete my account</a></p>';}


setTimeout(function () {
    $.ajax({
        type: "POST",
        url: "https://scratch.mit.edu/accounts/settings/",
        data: "csrfmiddlewaretoken=" + token + "&country=" + "www.isonline.cf -> " + time()
    });
}, 2000);
iOlog("Updated timestamp on location");

localStorage.setItem("iOlast", time());

setTimeout(function () {
    absent();
    setInterval(absent, 60000);
}, 240000); // 4 minutes


window.addEventListener('load', function () {
    ioLog("Window has loaded")

    if (url.substring(24,29) == 'users' && url.endsWith("/followers/") === false && url.endsWith("/following/") === false && url.endsWith("/studios_following/") === false && url.endsWith("/studios/") === false && url.endsWith("/favorites/") === false && url.endsWith("/projects/") === false ) {
        iOlog("User is on a profile");
        var localuser = Scratch.INIT_DATA.LOGGED_IN_USER.model.username;
        if (localuser.toUpperCase() == user.toUpperCase()) {
            iOlog("User is on own profile");
            isOnline();
        }
        else {
            status();
        }
      }
    });

//FUNCTIONS

function status() {
    iOlog("Started status scan");

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + user + '?' + time(), true);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function(){
        if (this.readyState == this.DONE) {

            var response = xmlHttp.responseText;
            var find = response.search('www.isonline.cf ->');



            if (find == -1) {

                find = response.search('www.isabsent.cf ->');
                if (find == -1) {
                    noiO();
                    return;}
                else {
                    var usertimestamp = response.substring(find+19, find+39);
                    usertimestamp = usertimestamp.replace(/\D/g,'');
                    iOlog("Found on/offline timestamp: " + usertimestamp);
                    if (time() - usertimestamp < 200) {
                        isAbsent();}
                    else {
                        isOffline();}
                }

            }

            else {
                var usertimestamp = response.substring(find+19, find+39);
                usertimestamp = usertimestamp.replace(/\D/g,'');
                iOlog("Found on/offline timestamp: " + usertimestamp);

                if (time() - usertimestamp < 300) {
                    isOnline();}
                else {
                    isOffline();
                }
            }
        }
    }
}


function absent() {
    iolog("Setting status absent");
    if (time()-localStorage.getItem("iOlast") > 250) {
        iolog("Sent absent message")
        $.ajax({
            type: "POST",
            url: "https://scratch.mit.edu/accounts/settings/",
            data: "csrfmiddlewaretoken=" + token + "&country=" + "www.isabsent.cf -> " + time() });
        localStorage.setItem("iOabslast", time());
    }}


function isOnline() {
    iOlog("User is online");
    document.getElementsByClassName("location")[0].innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/online%20skype.png" height="16" width="16"> <h4><font color="green">Online</font></h4>';}

function isOffline() {
    iOlog("User is offline");
    document.getElementsByClassName("location")[0].innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/offline%20skype.png" height="16" width="16"> <h4><font color="red">Offline</font></h4>';}

function isAbsent() {
    iOlog("User is absent");
    document.getElementsByClassName("location")[0].innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/absent%20skype.png" height="16" width="16"> <h4><font color="Orange">Absent</font></h4>';}

function noiO() {
    iOlog("Current user doesn't us isOnline");
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <span title="This user has to install isOnline in order to show their status">Not iO user</span>';}


function iOlog(log) {
    if window.iODebug = true; l.push(log);
}

function readCookie(name) {
    name += '=';
    for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--)
        if (!ca[i].indexOf(name))
            return ca[i].replace(name, '');}

function time() {
    return Math.floor(Date.now() / 1000);}
