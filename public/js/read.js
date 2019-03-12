document.addEventListener("DOMContentLoaded", function(event) {
        
    ctrlBtns();
    dropDownBox();
});

function dropDownBox() {
  document.getElementById("sortBtn").addEventListener("click", function(event) {
    var url = "/read?col=" + document.getElementById("sort-dropdown").value;
    url += "&sortBy=" + document.getElementById("sortBy").value;
    console.log(url);
    window.location.href = url;
  });
}

// controls which form to display
function ctrlBtns() {

    document.getElementById("btn-poke").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form");
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display = "none";
        }
        document.getElementById("container-poke").style.display = "block";
    });

    document.getElementById("btn-type").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form");
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-type").style.display = "block";
    });


    document.getElementById("btn-move").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form")
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-move").style.display = "block";
    });

    document.getElementById("btn-location").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form")
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-location").style.display = "block";
    });
}
