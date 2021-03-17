let listId = [];

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

$.ajax({
   url: 'https://api.stackexchange.com/2.2/questions/' + listId.join(';') + '/answers?pagesize=100&order=desc&sort=votes&site=stackoverflow&filter=!b6Aub*uCt1FjWD',
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
         });
      } 
   }
});

