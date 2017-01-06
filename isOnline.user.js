// ==UserScript==
// @name         isOnline
// @namespace    http://isonline.cf/
// @version      0.1
// @description  Know who is online on Scratch!
// @author       @World_Languages with help from @JuegOStrower and alpha testers
// @match        https://scratch.mit.edu/*
// @icon         https://raw.githubusercontent.com/WorldLanguages/isOnline/master/green%20cat.png
// @downloadURL  https://github.com/WorldLanguages/isOnline/raw/master/isOnline.user.js
// @updateURL    https://github.com/WorldLanguages/isOnline/raw/master/isOnline.user.js
// ==/UserScript==

console.log("Userscript started");

var l = "isOnline log: ";
var url = window.location.href;
var user1 = url.substring(30,100);
var user = user1.substring(0, user1.indexOf('/')); // var user = profile user is on
var token = readCookie('scratchcsrftoken');


if (url == 'https://scratch.mit.edu/' || url.startsWith('https://scratch.mit.edu/explore/') || url.startsWith('https://scratch.mit.edu/search/')) {
    var script = document.createElement('script');script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";document.getElementsByTagName('head')[0].appendChild(script);}


if (window.location.href == 'https://scratch.mit.edu/accounts/settings/') {
    console.log(l+"Disabled access to location change");
    document.getElementsByClassName("box-content tabs-content")[0].innerHTML = '<h4>Edit your account settings</h4> <br> <div class="field-wrapper"><label>Username</label><span>' + Scratch.INIT_DATA.LOGGED_IN_USER.model.username + '</span></div><label>Location</label> <select style="cursor:not-allowed"> <option> Not changeable</option> </select> <br>Sorry, by using isOnline you cannot use a location in your profile. <br> <button style="cursor:not-allowed" type="submit">Save my Changes</button> <br> <br> <p><a href="/accounts/settings/delete_account_confirmation/">I want to delete my account</a></p>';}



window.onload = function() {

    console.log(l+"Detected that page finished loading");



    $.ajax({
        type: "POST",
        url: "https://scratch.mit.edu/accounts/settings/",
        data: "csrfmiddlewaretoken=" + token + "&country=" + "www.isonline.cf -> " + time() });

    localStorage.setItem("iOlast", time());
    console.log(l+"Updated timestamp on location");



    setTimeout(function () {
        setInterval(absent, 45000);
    }, 240000); // 4 minutes



    if (url.substring(24,29) == 'users' && url.endsWith("/followers/") === false && url.endsWith("/following/") === false && url.endsWith("/studios_following/") === false && url.endsWith("/studios/") === false && url.endsWith("/favorites/") === false && url.endsWith("/projects/") === false ) {
        console.log(l+"Detected user is in a profile");
        var localuser = Scratch.INIT_DATA.LOGGED_IN_USER.model.username;
        if (localuser.toUpperCase() == user.toUpperCase()) {
            console.log(l+"Detected user is their own profile");
            isOnline();}
        else {
            status();}}


};


















//FUNCTIONS

function status() {

    console.log(l+"Started status scan");


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
                    console.log(l+"Found timestamp for absent/offline status: " + usertimestamp);
                    if (time() - usertimestamp < 300) {
                        isAbsent();}
                    else {
                        isOffline();}
                }

            }


            else {

                var usertimestamp = response.substring(find+19, find+39);
                usertimestamp = usertimestamp.replace(/\D/g,'');
                console.log(l+"Found timestamp for online/offline statuses: " + usertimestamp);


                if (time() - usertimestamp < 350) {
                    isOnline();}
                else {
                    isOffline();}


            }



        }};}











function absent() {
    console.log(l+"absent() started");

    if (time()-localStorage.getItem("iOlast") > 250) {
        console.log(l+"Sent absent request");
        $.ajax({
            type: "POST",
            url: "https://scratch.mit.edu/accounts/settings/",
            data: "csrfmiddlewaretoken=" + token + "&country=" + "www.isabsent.cf -> " + time() });}}






function isOnline() {
    console.log(l+"Detected that the user is online");
    document.getElementsByClassName("location")[0].innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/online%20skype.png" height="16" width="16"> <h4><font color="green">Online</font></h4>';}

function isOffline() {
    console.log(l+"Detected that the user is offline");
    document.getElementsByClassName("location")[0].innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/offline%20skype.png" height="16" width="16"> <h4><font color="red">Offline</font></h4>';}

function isAbsent() {
    console.log(l+"Detected that the user is absent");
    document.getElementsByClassName("location")[0].innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/absent%20skype.png" height="16" width="16"> <h4><font color="Orange">Absent</font></h4>';}

function noiO() {
    console.log(l+"Detected that the user didn't install isOnline, stopped status finding until page is refreshed");
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <span title="This user has to install isOnline in order to show their status">Not iO user</span>';}





function readCookie(name) {
    name += '=';
    for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--)
        if (!ca[i].indexOf(name))
            return ca[i].replace(name, '');}





function time() {
    return Math.floor(Date.now() / 1000);}
