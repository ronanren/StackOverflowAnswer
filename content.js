let listId = [];

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
   try{
      let url = new URL(element.closest("a").href);
      if (url.host == 'stackoverflow.com' && !isNaN(url.pathname.split('/')[2])){
         listId.push(url.pathname.split('/')[2]);
         var button = document.createElement("button");
         button.innerHTML = "Direct Answer";
         button.setAttribute('url', url);
         button.setAttribute('id', url.pathname.split('/')[2]);
         button.setAttribute('class', "buttonAnswer" + url.pathname.split('/')[2]);
         element.closest("div").appendChild(button);
      }

      if (i == 0 && url.host == 'stackoverflow.com'){
         console.log("StackOverflow !!!");
      }
   } catch (error) {}
});

// Request Ajax to obtain the best answer of each StackOverflow topics
$.ajax({
   url: 'https://api.stackexchange.com/2.2/questions/' + listId.join(';') + '/answers?pagesize=100&order=desc&sort=votes&site=stackoverflow&filter=!b6Aub*uCt1FjWD&key=9hS39Y0q)hDJL2rDsWfA*g((',
   type: 'GET',
   success: function(data){
      var answers = {};
      listId.forEach(id => {
         let bestAnswer = "";
         let score = -20;
         data.items.some(answer => {
            if (answer.question_id == id && answer.is_accepted == true){
               bestAnswer = answer;
               return true;
            } else if (answer.question_id == id && answer.score >= score){
               bestAnswer = answer;
               score = answer.score;
            }
         });
         answers[id] = bestAnswer;
      });
      for (var answer in answers){
         var button = document.getElementsByClassName('buttonAnswer' + answers[answer].question_id);
         button[0].innerHTML += ' (' + answers[answer].score + ')';
         button[0].addEventListener("click", function(event) {
            console.log(answers[event.target.getAttribute('id')]);
            $('.StackOverflowAnswer-sidebarTitleMain').text(answers[event.target.getAttribute('id')].title).html();
            $('.StackOverflowAnswer-sidebarTitleMain').attr('href', event.target.getAttribute('url'));
            $('.StackOverflowAnswer-sidebarTitleUrl').text(event.target.getAttribute('url') + '#' + answers[event.target.getAttribute('id')].answer_id).html();
            $('.StackOverflowAnswer-sidebarTitleUrl').attr('href', event.target.getAttribute('url') + '#' + answers[event.target.getAttribute('id')].answer_id);
            $('.StackOverflowAnswer-sidebarAnswer').html(answers[event.target.getAttribute('id')].body + '<p>--' + answers[event.target.getAttribute('id')].owner.display_name + '</p>');
            $('pre').attr('class', 'prettyprint');
            $('code').attr('class', 'prettyprint');
            PR.prettyPrint();
         });
      } 
   }
});

