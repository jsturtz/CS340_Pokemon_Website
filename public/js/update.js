document.addEventListener("DOMContentLoaded", function(event) {
    
    // controls which form to display
    document.getElementById("btn-poke").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form")
        console.log(forms)
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-poke").style.display = "block";
    });

    document.getElementById("btn-type").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form")
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-type").style.display = "block";
    });

    document.getElementById("btn-location").addEventListener("click", function(event) {
        let forms = document.getElementsByClassName("change-form")
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display= "none";
        }
        document.getElementById("container-location").style.display = "block";
    });
    
    // controls toggling of change forms
    let onToggles = document.getElementsByClassName("toggle-on");
    for (let i = 0; i < onToggles.length; i++) {
        let btn = onToggles[i]
        console.log(btn);
        btn.addEventListener("click", function(event) {
            // hide first div "poke-display" found before this element
            let toHide = btn.parentNode.parentNode;
            toHide.setAttribute("style", "display:none;"); 

            // un-hide first div "add-form" found after this element
            let toDisplay = toHide.nextElementSibling;
            toDisplay.setAttribute("style", "display:block;");
        });
    }
});
