document.addEventListener("DOMContentLoaded", function(event) {
  
  ctrlBtns();
  bindPokeDelete();
  bindTypeDelete();
  bindMoveDelete();
  bindLocationDelete();
});

function upperFirstChar(string) {
  string = string.trim();
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function upperEveryFirstChar(string) {

  var arr = string.split(" ")
  for (var i = 0; i < arr.length; i++) {
    arr[i] = upperFirstChar(arr[i]);
  }
  return arr.join(" ");
}

function get() {
    var req = new XMLHttpRequest();
    req.open("GET", "/delete", true);
    req.addEventListener("load", function(event) {
      if (req.status >= 200 && req.status < 400) return req.body;
      else window.alert(req.responseText) 
    });
    req.send(); 
}

function post(payload) {
  var req = new XMLHttpRequest();
  req.open("POST", "/delete", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function(event) {
    if (req.status >= 200 && req.status < 400) window.alert(req.responseText)
    else window.alert(req.responseText) 
  });
  req.send(JSON.stringify(payload)); 
}

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

function bindPokeDelete() {
  document.getElementById("deletePoke").addEventListener("click", function(event) {
  var payload = {
    action: "delete_Poke",
    name: document.getElementById("deletePokeDrop").value 
  };
  post(payload);
  event.preventDefault;
  });
}

function bindTypeDelete() {
  document.getElementById("deleteType").addEventListener("click", function(event) {
  var payload = {
    action: "delete_Type",
    name: document.getElementById("deleteTypeDrop").value
  };
  post(payload);
  event.preventDefault;
  });
}

function bindMoveDelete() {
  document.getElementById("deleteMove").addEventListener("click", function(event) {
  var payload = {
    action: "delete_Move",
    name: document.getElementById("deleteMoveDrop").value
  };
  post(payload);
  event.preventDefault;
  });
}

function bindLocationDelete() {
  document.getElementById("deleteLocation").addEventListener("click", function(event) {
  var payload = {
    action: "delete_Location",
    name: document.getElementById("deleteLocationDrop").value
  };
  post(payload);
  event.preventDefault;
  });
}
