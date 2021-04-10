let listId = [];
let showOnLoad = false;

// Create sidebar
var columnResult = document.getElementById('center_col');
var sidebar = document.createElement('div');
sidebar.setAttribute('class', 'StackOverflowAnswer-sidebar');
columnResult.parentNode.insertBefore(sidebar, columnResult.nextSibling);
var sidebarTitle = document.createElement('div');
sidebarTitle.setAttribute('class', 'StackOverflowAnswer-sidebarTitle');
var sidebarAnswer = document.createElement('div');
sidebarAnswer.setAttribute('class', 'StackOverflowAnswer-sidebarAnswer');
sidebar.appendChild(sidebarTitle);
sidebar.appendChild(sidebarAnswer);
var a = document.createElement('a');
a.setAttribute('class', 'StackOverflowAnswer-sidebarTitleMain')
sidebarTitle.appendChild(a);
var a = document.createElement('a');
a.setAttribute('class', 'StackOverflowAnswer-sidebarTitleUrl')
sidebarTitle.appendChild(a);

// Parse Google Search to insert button on StackOverflow topics
$('h3, .fl').toArray().forEach((element, i) => {
   try {
      let url = new URL(element.closest("a").href);
      if (url.host == 'stackoverflow.com' && !isNaN(url.pathname.split('/')[2])) {
         listId.push(url.pathname.split('/')[2]);
         var button = document.createElement("button");
         button.innerHTML = "Direct Answer";
         button.setAttribute('url', url);
         button.setAttribute('id', url.pathname.split('/')[2]);
         button.setAttribute('class', "buttonAnswer" + url.pathname.split('/')[2]);
         element.closest("div").appendChild(button);
      }
      if (i == 0 && url.host == 'stackoverflow.com' && !isNaN(url.pathname.split('/')[2])) {
         showOnLoad = true;
      }
   } catch (error) { }
});

// Request Ajax to obtain the best answer of each StackOverflow topics
if (listId.length) {
   chrome.storage.sync.get(['keyApi', 'colorMode'], function (settings) {
      $.ajax({
         url: 'https://api.stackexchange.com/2.2/questions/' + listId.join(';') + '/answers?pagesize=100&order=desc&site=stackoverflow&filter=!b6Aub*uCt1FjWD' + (settings.keyApi != '' ? "&key=" + settings.keyApi : ""),
         type: 'GET',
         success: function (data) {
            var answers = {};
            listId.forEach(id => {
               let bestAnswer = "";
               let score = -8000;
               data.items.some(answer => {
                  if (answer.question_id == id && answer.is_accepted == true) {
                     bestAnswer = answer;
                     return true;
                  } else if (answer.question_id == id && answer.score >= score) {
                     bestAnswer = answer;
                     score = answer.score;
                  }
               });
               answers[id] = bestAnswer;
            });
            for (var answer in answers) {
               var buttons = document.getElementsByClassName('buttonAnswer' + answer);
               for (var i = 0; i < buttons.length; i++) {
                  if (answers[answer]) {
                     buttons[i].innerHTML += ' (' + answers[answer].score + ')';
                     buttons[i].addEventListener("click", function (event) {
                        // console.log(answers[event.target.getAttribute('id')]);
                        if ($('.StackOverflowAnswer-sidebarTitleMain').attr('href') != event.target.getAttribute('url')) {
                           $('.StackOverflowAnswer-sidebar').css('display', 'block');
                           $('.StackOverflowAnswer-sidebarTitleMain').html(answers[event.target.getAttribute('id')].title).text();
                           $('.StackOverflowAnswer-sidebarTitleMain').attr('href', event.target.getAttribute('url'));
                           $('.StackOverflowAnswer-sidebarTitleUrl').text(event.target.getAttribute('url') + '#' + answers[event.target.getAttribute('id')].answer_id).html();
                           $('.StackOverflowAnswer-sidebarTitleUrl').attr('href', event.target.getAttribute('url') + '#' + answers[event.target.getAttribute('id')].answer_id);
                           $('.StackOverflowAnswer-sidebarAnswer').html(answers[event.target.getAttribute('id')].body + '<p>--' + answers[event.target.getAttribute('id')].owner.display_name + '</p>');
                           $('pre').attr('class', 'prettyprint');
                           $('code').attr('class', 'prettyprint');
                           PR.prettyPrint();
                           $('.StackOverflowAnswer-sidebar')
                           $('.StackOverflowAnswer-sidebar').removeClass("animation");
                           window.requestAnimationFrame(function (time) {
                              $('.StackOverflowAnswer-sidebar').addClass("animation");
                           });
                           $('.StackOverflowAnswer-sidebarAnswer').scrollTop(0);
                        }
                     });
                  } else {
                     buttons[i].innerHTML = 'No Answer';
                     buttons[i].style.backgroundColor = '#7f8c8d';
                     buttons[i].disabled = true;
                  }
               }
            }
            // Detect to show/unshow automatically after load
            if (showOnLoad && document.getElementsByClassName('buttonAnswer' + listId[0])[0].innerHTML != 'No Answer') {
               $('.StackOverflowAnswer-sidebar').css('display', 'block');
               $('.buttonAnswer' + listId[0]).click();
            }
         }
      });
   });

}
