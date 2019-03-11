document.addEventListener("DOMContentLoaded", function(event) {
  
  bindCtrlBtns();
  bindTogglePoke();
  bindToggleType();

});

function bindCtrlBtns() {
  // controls which form to display
  document.getElementById("btn-poke").addEventListener("click", function(event) {
    let forms = document.getElementsByClassName("change-form")
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

function bindTogglePoke() {
  // controls toggling of change forms
  let onToggles = document.getElementsByClassName("toggle-on");
  for (let i = 0; i < onToggles.length; i++) {
    let btn = onToggles[i]
    btn.addEventListener("click", function(event) {
      // hide first div "poke-display" found before this element
      let toHide = btn.parentNode.parentNode;
      toHide.setAttribute("style", "display:none;"); 

      // un-hide first div "add-form" found after this element
      let toDisplay = toHide.nextElementSibling;
      toDisplay.setAttribute("style", "display:block;");
    });
  }
}

function bindToggleType() {
  let btns = document.getElementsByClassName("type-btn");
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(event) {
      let weakCol = btns[i].parentElement.previousElementSibling;
      let strongCol = weakCol.previousElementSibling;
      let changeForm = document.getElementById("type-change");
      changeForm.style = "display:block;";
      weakCol.innerHTML = changeForm.outerHTML;
      strongCol.innerHTML = changeForm.outerHTML;
      weakCol.value = weakVal;
      strongCol.value = strongVal;
    });
  }
}
    
