document.addEventListener("DOMContentLoaded", function(event) {
  
  var btns = document.getElementsByClassName("add-btn");
  var tables = document.getElementsByClassName("add-tables");
  for (var i = 0; i < btns.length; i++) {
    btns.item(i).addEventListener("click", function(event) {
      var paren = btns.item(i).parentElement;
      var table = paren.querySelector(".add-table");
      var newHtml = table.querySelector("input").outerHTML;
      var temp = document.createElement("div");
      temp.innerHTML = newHtml;
      table.appendChild(temp.firstElementChild);
    });
  }
});

