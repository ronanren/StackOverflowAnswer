let url;
let listId = [];

$('h3').toArray().forEach((element, i) => {
   try{
      url = new URL(element.closest("a").href);
      if (url.host == 'stackoverflow.com'){
         listId.push(url.pathname.split('/')[2]);
         var button = document.createElement("button");
         button.innerHTML = "Direct Answer";
         button.setAttribute("url", url);
         button.addEventListener("click", function(event) {
            var targetElement = event.target;
            console.log(targetElement.getAttribute('url'));
            $.ajax({
               url: "https://api.stackexchange.com/2.2/questions/24016609/answers?order=desc&sort=activity&site=stackoverflow&filter=!b6Aub*uCt1FjWD",
               type: 'GET',
               success: function(data){
                  console.log(data);
               }
            });
         });
         element.closest("div").appendChild(button);
      }

      if (i == 0 && url.host == 'stackoverflow.com'){
         console.log("StackOverflow !!!");
      }
   } catch (error) {}
});
