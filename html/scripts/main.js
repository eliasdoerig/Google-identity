
/*Define Users------------------------------------------------------------------------*/
var user = [];
$(document).ready(() => {
    $.getJSON('json/elias.json', function(json){
        let jsonObj = json;
       user.push(jsonObj);
    });
    $.getJSON('json/data.json', function(json){
        let jsonObj = json;
       user.push(jsonObj);
    });
});
/*------------------------------------------------------------------------------------*/

/*Diagrams variables------------------------------------------------------------------*/
var diagramWidth = ($(window).width()*0.4)-30;
var dayWidth = diagramWidth/365;
var monthWidth = diagramWidth/12;
var count = 0;

/*------------------------------------------------------------------------------------*/

/*Page Contents-----------------------------------------------------------------------*/
let homeContent = '';
let yearContent = '';
let wordContent = '';

/*------------------------------------------------------------------------------------*/

/*Navigation Position-----------------------------------------------------------------*/
var positionUser = null;
var positionYear = null;
var positionShowAdd = false;

/*------------------------------------------------------------------------------------*/

/*Word animation interval-------------------------------------------------------------*/
var aniInterval;

/*------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------*/
/*Document ready----------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
$(document).ready(function(){
    setTimeout(() => { 
    //Detect Browser Back –> goBack()
    window.onhashchange = function(){
    window.history.pushState('home', 'Google Identity', '/');
    goBack();
    }

    //Listener for #back button
    $('#back').on('click', goBack);

    //Define HOME content
    defineHomeContent();
    $('.container').html(homeContent);
    createUserDiagrams();

    //WORD Animation
    $('.container').on('mouseover','.barYear2008', () => {
            loopWordStart(2008);
        });
    $('.container').on('mouseover','.barYear2009', () => {
            loopWordStart(2009);
        });
    $('.container').on('mouseover','.barYear2010', () => {
            loopWordStart(2010);
        });
    $('.container').on('mouseover','.barYear2011', () => {
            loopWordStart(2011);
        });
    $('.container').on('mouseover','.barYear2012', () => {
            loopWordStart(2012);
        });
    $('.container').on('mouseover','.barYear2013', () => {
            loopWordStart(2013);
        });
    $('.container').on('mouseover','.barYear2014', () => {
            loopWordStart(2014);
        });
    $('.container').on('mouseover','.barYear2015', () => {
            loopWordStart(2015);
        });
     $('.container').on('mouseover','.barYear2016', () => {
            loopWordStart(2016);
        });
     $('.container').on('mouseover','.barYear2017', () => {
            loopWordStart(2017);
        });

    $('.container').on('mouseout','.barYear', () => {
            clearInterval(aniInterval);
            $('.header-left').html('<h1>Number of<br>searches</h1>')
        });
     $('.container').on('click','.barYear', () => {
            clearInterval(aniInterval);
            $('.header-left').html('<h1>Searched<br>words</h1>')
        });
        }, 300);
});

/*------------------------------------------------------------------------------------*/
/*CHANGE CONTENTS---------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/

/*show HOME---------------------------------------------------------------------------*/
function showHome(){
    $('.container').addClass('fade-out');
    //Change URL
    window.history.pushState('home', 'Google Identity', '/');
    //show HOME
    setTimeout(function(){
        //Change Title
        $('.header-left').html('<h1>Google identity<br>from 2016</h1>');
        //Define content
        $('.container').html(homeContent);
        createUserDiagrams();
        $('.container').removeClass('fade-out');
    }, 600);
}
/*------------------------------------------------------------------------------------*/

/*Show YEAR---------------------------------------------------------------------------*/
function showYear(ofUser){
    positionUser = ofUser;
    if(positionShowAdd == true){
        showAddUser();
    }
    //show Back button
    $('#back').css('opacity',1);
    //Change URL
    window.history.pushState('years', 'Years', '/#years');
    //show YEAR
    $('.container').addClass('fade-out');
        setTimeout(function(){
        //Change Title
        $('.header-left').html('<h1>Number of<br>searches</h1>');
        //Define content
        defineYearContent(positionUser);
        $('.container').html(yearContent);
        createYearDiagrams(positionUser);
        $('.container').removeClass('fade-out');
    }, 600);
}
/*------------------------------------------------------------------------------------*/

/*Show WORDS--------------------------------------------------------------------------*/
function showWords(year){
    positionYear = year;;
    //Change URL
    window.history.pushState('words', 'Words', '/#words');
    //show WORDS
    $('.container').addClass('fade-out');
        setTimeout(function(){
        //Change Title
         $('.header-left').html('<h1>Searched<br>words</h1>')
        //Define content
        defineWordContent(positionYear);
        $('.container').html(wordContent);
        createWordDiagrams(positionYear);
        $('.container').removeClass('fade-out');
    }, 600);
}
/*------------------------------------------------------------------------------------*/

/*GO BACK--------------------------------------------------------------------------*/
function goBack(){
    if(positionShowAdd == true){
        showAddUser();
    }
    else if(positionYear !== null){
        showYear(positionUser);
        positionYear = null;
    }
    else{
        showHome();
        positionUser = null;
    }

    if(positionUser == null){
        $('#back').css('opacity', 0);
    }
}
/*------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------*/
/*DEFINE HOME CONTENT-----------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
function defineHomeContent(){
    //Content for every user
    for(var u = 0; u < user.length; u++){
        var Name = user[u].name;
        var Age = user[u].age;
        var Work = user[u].work;
        var nrSeaches = user[u].years[2016].nrTotSearches;
        var toAdd = 
          '<div class="user" onClick="showYear('+ u +')">'
        + '<div class="user-head"><h2>'+ Name +'</h2></div>'
        + '<div class="user-info"><p>'+ Age +' years old<br>'+ Work +'</p></div>'
        + '<div class="user-data" id="diagram'+ u +'"><hr><span>'+ nrSeaches +' searches</span></div>'
        + '</div>';
        homeContent += toAdd;
    }
    //Add user-add Button
    homeContent += 
        '<div class="user-add" id="user-add" onClick="showAddUser()">'
        +'<h2>+<br>Informations</h2>'
        +'</div>';
}
/*------------------------------------------------------------------------------------*/

/*Content DIAGRAM / D3.js--------------------------------------------------------------*/
function createUserDiagrams(){
    var userDiagramWidth = (diagramWidth/2)-30;
    var userMonthWidth = userDiagramWidth/12;
    var userCount = 0;

    for(var u = 0; u < user.length; u++){
        //USER DIAGRAM
        d3.select('#diagram' + u).selectAll('div')
            .data(user[u].years['2016'].nrMonthSearches)
            .enter()
            .append('div')
            .attr('class', 'barYearUser')
            .style('width', function(){
                return userMonthWidth + 'px';
            })
            .style('height', function(d){
                var barHeight = d/15;
                return barHeight + 'px';
            })
            .style('top', function(d){
                var barPosition = 60 - (d/30);
                return barPosition + 'px';
            })
            .style('left', function(){
                var barLeft = userCount * userMonthWidth;
                userCount++;
                return barLeft + 'px';
            });
            userCount = 0;
    }
}

/*------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------*/
/*DEFINE YEAR CONTENT-----------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
function defineYearContent(currentUser){
    let name = user[positionUser].name;
    yearContent = returnBasicDiagram(name);

    for(var y in user[currentUser].years) {
        var year = y;
        var numberOfSearches = user[currentUser].years[y].nrTotSearches;
        var toAdd = '<div class="diagram-container">'
            +'<div class="digaram-info-container">'
                +'<p>'+ year +'<br><span>'+ numberOfSearches +' searches</span></p>'
            +'</div>'
            +'<div class="diagram-year" id="diagramYear'+ y +'" onClick="showWords('+ y +')">'
            + '<hr>'
            +'</div>'
            +'</div>';
        yearContent += toAdd;   
    }
    yearContent += '</div>';
}

/*------------------------------------------------------------------------------------*/

/*year DIAGRAM / D3.js-----------------------------------------------------------------*/
function createYearDiagrams(currentUser){
    for(var y in user[currentUser].years) {
         //YEAR DIAGRAM
        d3.select('#diagramYear' + y).selectAll('div')
                .data(user[currentUser].years[y].nrMonthSearches)
                .enter()
                .append('div')
                .attr('class', () => {
                    return 'barYear barYear' + y;
                })
                .style('width', function(){
                    return monthWidth + 'px';
                })
                .style('height', function(d){
                    var barHeight = d/15;
                    return barHeight + 'px';
                })
                .style('top', function(d){
                    var barPosition = 60 - (d/30);
                    return barPosition + 'px';
                })
                .style('left', function(){
                    var barLeft = count * monthWidth;
                    count++;
                    return barLeft + 'px';
                });
    count = 0;
    }
}
/*------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------*/
/*DEFINE WORD CONTENT-----------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
function defineWordContent(currentYear){
    let name = user[positionUser].name;
    wordContent = returnBasicDiagram(name);
    for(var y = 0; y < user[positionUser].years[currentYear].allWordsWithDate.length; y++){
        var word = user[positionUser].years[currentYear].allWordsWithDate[y].word;
        var numberOfSearches = user[positionUser].years[currentYear].allWordsWithDate[y].TotWordSearches;
        var toAdd = '<div class="diagram-container">'
            +'<div class="digaram-info-container">'
                +'<p>'+ word +'<br><span>searched '+ numberOfSearches +' times</span></p>'
            +'</div>'
            +'<div class="diagram-word" id="diagramWord'+ y +'">'
            + '<hr>'
            +'</div>'
            +'</div>';
        wordContent += toAdd;
    }
    yearContent += '</div>';
}
/*------------------------------------------------------------------------------------*/

/*word DIAGRAM / D3.js-----------------------------------------------------------------*/
function createWordDiagrams(currentYear){
    for(var y = 0; y < user[positionUser].years[currentYear].allWordsWithDate.length; y++){
         //WORD DIAGRAM
        d3.select('#diagramWord' + y).selectAll('div')
            .data(user[positionUser].years[currentYear].allWordsWithDate[y].frequence)
            .enter()
            .append('div')
            .attr('class', 'barWord')
            .style('width', function(){
                return dayWidth + 'px';
            })
            .style('height', function(d){
                var barHeight = 20;
                return barHeight + 'px';
            })
            .style('top', function(){
                var barPosition = 50;
                return barPosition + 'px';
            })
            .style('left', function(d){
                var value = d-1;
                var barLeft = value * dayWidth;
                return barLeft + 'px';
            });
    }
}

/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/


/*Return Diagram structure on the back------------------------------------------------*/
function returnBasicDiagram(name){
    return    '<div class="user-head">'
            + '<h2>'+ name +'</h2>'
            + '</div>'
            + '<div class="col-12">JAN</div>'
            + '<div class="col-12">FEB</div>'
            + '<div class="col-12">MAR</div>'
            + '<div class="col-12">APR</div>'
            + '<div class="col-12">MAY</div>'
            + '<div class="col-12">JUN</div>'
            + '<div class="col-12">JUL</div>'
            + '<div class="col-12">AGO</div>'
            + '<div class="col-12">SEP</div>'
            + '<div class="col-12">OKT</div>'
            + '<div class="col-12">NOV</div>'
            + '<div class="col-12">DEC</div>'
            + '<div class="scroll-div">';
}
/*------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------*/
function showAddUser(){
    //show Back button
    //Animation
    $('.container').toggleClass('slide-left');
    $('.header-left').toggleClass('fade-out');
    $('.add-user-container').toggleClass('display-block');
    if(positionShowAdd == true){
        $('#back').css('opacity', 0);
        positionShowAdd = false;
    }
    else{
        $('#back').css('opacity', 1);
        positionShowAdd = true;
    }
}
/*------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------*/
function loopWordStart(year){
    var i = 0;
            aniInterval = setInterval(() => {
            if(i == user[positionUser].years[year].allWords.length){
                i = 0;
                $('.header-left').html('<h1>' + user[positionUser].years[year].allWords[i] + '</h1>');
            }else{
                $('.header-left').html('<h1>' + user[positionUser].years[year].allWords[i] + '</h1>');
                i++;
            }
        },100);
}
/*------------------------------------------------------------------------------------*/