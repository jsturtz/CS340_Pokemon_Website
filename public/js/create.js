document.addEventListener("DOMContentLoaded", function(event) {
  
  bindNavBtns();
  bindToggleBtns();
  bindTypeSubmit();
  bindMoveSubmit();
  bindLocationSubmit();
  bindPokeSubmit();
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
    req.open("GET", "/create", true);
    req.addEventListener("load", function(event) {
      if (req.status >= 200 && req.status < 400) return req.body;
      else window.alert(req.responseText) 
    });
    req.send(); 
}

function post(payload) {
    var req = new XMLHttpRequest();
    req.open("POST", "/create", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(event) {
      if (req.status >= 200 && req.status < 400) window.alert(req.responseText)
      else window.alert(req.responseText) 
    });
    req.send(JSON.stringify(payload)); 
    event.preventDefault;
}

function bindToggleBtns() {
  document.getElementById("add-relations-btn").addEventListener("click", function(event) {
    document.getElementById("add-type").style.display = "none"; 
    document.getElementById("add-type-relation").style.display = "block";
  });

  document.getElementById("add-types-btn").addEventListener("click", function(event) {
    document.getElementById("add-type").style.display = "block"; 
    document.getElementById("add-type-relation").style.display = "none";
  }); 
}

function bindNavBtns() {
  document.getElementById("btn-poke").addEventListener("click", function(event) {
    var forms = document.getElementsByClassName("add-form")
    console.log(forms)
    for (var i = 0; i < forms.length; i++) {
      forms[i].style.display= "none";
    }
    document.getElementById("container-poke").style.display = "block";
  });

  document.getElementById("btn-type").addEventListener("click", function(event) {
    var forms = document.getElementsByClassName("add-form")
    for (var i = 0; i < forms.length; i++) {
      forms[i].style.display= "none";
    }
    document.getElementById("container-type").style.display = "block";
  });


  document.getElementById("btn-move").addEventListener("click", function(event) {
    var forms = document.getElementsByClassName("add-form")
    for (var i = 0; i < forms.length; i++) {
      forms[i].style.display= "none";
    }
    document.getElementById("container-move").style.display = "block";
  });

  document.getElementById("btn-location").addEventListener("click", function(event) {
    var forms = document.getElementsByClassName("add-form")
    for (var i = 0; i < forms.length; i++) {
      forms[i].style.display= "none";
    }
    document.getElementById("container-location").style.display = "block";
  });
}

function bindTypeSubmit() {
  document.getElementById("submit-type-relation-btn").addEventListener("click", function(event) {
    
    var relation = document.getElementById("relation").value; 
    if (relation === "weak") {
      var weak = document.getElementById("type1").value; 
      var strong = document.getElementById("type2").value; 
    } else {
      var weak = document.getElementById("type2").value; 
      var strong = document.getElementById("type1").value; 
    }

    var payload = {
      action: "type-relation", 
      weak: weak, 
      strong: strong
    };

    post(payload);
  });

  document.getElementById("submit-type-btn").addEventListener("click", function(event) {
    console.log(upperFirstChar(document.getElementById("type-input").value));
    var payload = {
      action: "type", 
      name: upperFirstChar(document.getElementById("type-input").value), 
    };
    post(payload); 
  });
}


function bindMoveSubmit() {
  document.getElementById("submit-move-btn").addEventListener("click", function(event) {
    
    var payload = {
      action: "move", 
      name: upperEveryFirstChar(document.getElementById("move-name").value), 
      effect: upperEveryFirstChar(document.getElementById("move-effect").value)
    };
    post(payload);
  });
}

function bindLocationSubmit() {
  document.getElementById("submit-location-btn").addEventListener("click", function(event) {
    
    console.log(upperEveryFirstChar(document.getElementById("location-name").value));
    var payload = {
      action: "location", 
      name: upperEveryFirstChar(document.getElementById("location-name").value), 
      description: document.getElementById("location-description").value
    };
    post(payload);
  });
}

function bindPokeSubmit() {
}
