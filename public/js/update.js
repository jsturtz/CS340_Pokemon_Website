document.addEventListener("DOMContentLoaded", function(event) {
  
  bindCtrlBtns();
  bindPokeUpdateBtn();
  bindTypeUpdateBtn();
  bindMoveUpdateBtn();
  bindLocationUpdateBtn();
  pokemonSelection();
  locationSelection();
  moveSelection();
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
    req.open("POST", "/update", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(event) {
      if (req.status >= 200 && req.status < 400) window.alert(req.responseText)
      else window.alert(req.responseText) 
    });
    req.send(JSON.stringify(payload)); 
}

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

function bindPokeUpdateBtn() {
   let container = document.getElementById("container-poke");
   container.querySelector("button").addEventListener("click", function(event) {
    console.log('this code is hit');
    let payload = {
      action: "pokemon", 
      id: document.getElementById("poke-id").value, 
      name: upperEveryFirstChar(document.getElementById("poke-name").value), 
      health: upperEveryFirstChar(document.getElementById("poke-health").value), 
      attack: upperEveryFirstChar(document.getElementById("poke-attack").value), 
      defense: upperEveryFirstChar(document.getElementById("poke-defense").value), 
      speed: upperEveryFirstChar(document.getElementById("poke-speed").value)
    };
    console.log(payload);
     post(payload);
    event.preventDefault;
 });

}

function bindTypeUpdateBtn() {
  let container = document.getElementById("container-type");
  container.querySelector("button").addEventListener("click", function(event) {
 
    console.log('this code is hit');
    let payload = {
      action: "type", 
      id: document.getElementById("type-id").value, 
      name: upperEveryFirstChar(document.getElementById("type-name").value)
    };
    console.log(payload);
    post(payload);
    event.preventDefault;
 });
}

function bindMoveUpdateBtn() {
 let container = document.getElementById("container-move");
  container.querySelector("button").addEventListener("click", function(event) {
    let payload = {
      action: "move", 
      id: document.getElementById("move-id").value, 
      name: upperEveryFirstChar(document.getElementById("move-name").value), 
      status_effect: document.getElementById("move-status").value
    };
    console.log(payload);
    post(payload);
    event.preventDefault;
 });
}

function bindLocationUpdateBtn() {
 let container = document.getElementById("container-location");
  container.querySelector("button").addEventListener("click", function(event) {
    let payload = {
      action: "location", 
      id: document.getElementById("location-id").value, 
      name: upperEveryFirstChar(document.getElementById("location-name").value), 
      description: document.getElementById("location-description").value
    };
    post(payload);
    event.preventDefault;
 });
}



function pokemonSelection() {
  document.getElementById("poke-id").addEventListener("change", function() {
    let container = document.getElementById("container-poke");
    let id = document.getElementById("poke-id").value;
    let name = document.getElementById("poke-name");
    let health = document.getElementById("poke-health");
    let attack = document.getElementById("poke-attack");
    let defense = document.getElementById("poke-defense");
    let speed = document.getElementById("poke-speed");
    let description = document.getElementById("poke-description");
    let rows = container.querySelectorAll("div.poke");
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute("value") == id) {
        name.value = rows[i].querySelector(".poke-name").getAttribute("value");
        health.value = rows[i].querySelector(".health").value; 
        attack.value = rows[i].querySelector(".attack").value; 
        defense.value = rows[i].querySelector(".defense").value; 
        speed.value = rows[i].querySelector(".speed").value; 
        description.innerHTML = rows[i].querySelector(".description").value;
      }
    }
  });
}

function locationSelection() {
  document.getElementById("location-id").addEventListener("change", function() {
    let container = document.getElementById("container-location");
    let id = document.getElementById("location-id").value;
    let name = document.getElementById("location-name");
    let desc = document.getElementById("location-description");
    let rows = container.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute("value") == id) {
        name.value = rows[i].firstElementChild.textContent;
        desc.value = rows[i].lastElementChild.textContent;
      }
    }
  });
}

function moveSelection() {
  document.getElementById("move-id").addEventListener("change", function() {
    let container = document.getElementById("container-move");
    let id = document.getElementById("move-id").value;
    let name = document.getElementById("move-name");
    let effect = document.getElementById("move-status");
    let rows = container.querySelectorAll("tr");
    console.log(rows);
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute("value") == id) {
        name.value = rows[i].firstElementChild.textContent;
        effect.value = rows[i].lastElementChild.textContent;
      }
    }
  });
}
