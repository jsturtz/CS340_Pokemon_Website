document.addEventListener("DOMContentLoaded", function(event) {
        
    ctrlBtns();
    dropDownBox();
});

function dropDownBox() {
    document.getElementById("sortBtn").addEventListener("click", function(event) {
        var url = "/read?" + 
            "col=" + document.getElementById("dropdown").value + 
            "&sortBy=" + document.getElementById("sortBy").value;
        console.log(url);
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        // req.addEventListener("load", function(event) {
        //     if (req.status >= 200 && req.status < 400) {

        //     } else { throw "ERROR: " + req.status}
        // });
        req.send(null);
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
