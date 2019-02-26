document.addEventListener("DOMContentLoaded", function(event) {
    
    // controls which form to display
    document.getElementById("btn-poke").addEventListener("click", function(event) {
        var forms = document.getElementsByClassName("change-form")
        console.log(forms)
        for (var i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-poke").style.display = "block";
    });

    document.getElementById("btn-type").addEventListener("click", function(event) {
        var forms = document.getElementsByClassName("change-form")
        for (var i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-type").style.display = "block";
    });


    document.getElementById("btn-move").addEventListener("click", function(event) {
        var forms = document.getElementsByClassName("change-form")
        for (var i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-move").style.display = "block";
    });

    document.getElementById("btn-location").addEventListener("click", function(event) {
        var forms = document.getElementsByClassName("change-form")
        for (var i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-location").style.display = "block";
    });
});
