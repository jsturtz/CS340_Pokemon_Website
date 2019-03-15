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
    
    var weak = document.getElementById("type2-relation").value; 
    var strong = document.getElementById("type1-relation").value; 

    var relation = document.getElementById("relation").value;
    if (relation === "weak") {
      console.log("Relation is indeed weak");
      var weak = document.getElementById("type1-relation").value; 
      var strong = document.getElementById("type2-relation").value; 
    }

    var payload = {
      action: "type-relation", 
      weak: weak, 
      strong: strong
    };
    post(payload);
  });

  document.getElementById("submit-type-btn").addEventListener("click", function(event) {
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
    
    var payload = {
      action: "location", 
      name: upperEveryFirstChar(document.getElementById("location-name").value), 
      description: document.getElementById("location-description").value
    };
    post(payload);
  });
}

function bindPokeSubmit() {
  document.getElementById("submit-pokemon-btn").addEventListener("click", function(event) {
    var name = upperEveryFirstChar(document.getElementById("inp-name").value);
    var attack = document.getElementById("inp-attack").value;
    var defense = document.getElementById("inp-defense").value;
    var health = document.getElementById("inp-health").value;
    var speed = document.getElementById("inp-speed").value;

    // all fields must be filled out
    if (name && attack && defense && health && speed) {

      // evolutions must be different pokemon
      var evolves_to = document.getElementById("evolves_to").value;
      var evolves_from = document.getElementById("evolves_from").value;
      if (!evolves_to) evolves_to = null;
      if (!evolves_from) evolves_from = null;
      // will throw an error if both are not null and they are the same ids
      if (evolves_to !== evolves_from || !(evolves_to && evolves_from)) {
        
        // add location ids
        var location_rows = document.getElementsByClassName("location-field");
        var locations = [];
        for (var i = 0; i < location_rows.length; i++) {
          if (location_rows[i].checked) {
            locations.push(location_rows[i].value);
          }
        }

        // add moves if fields are filled out
        var move_rows = document.getElementsByClassName("move-row");
        var moves = [];
        for (var i = 0; i < move_rows.length; i++) {
          var level = move_rows[i].querySelector("input").value;
          var id = move_rows[i].querySelector("select").value;
          if (id) {
            moves.push({id: id, level: level}); 
          }
        }
        
        // add types if fields are filled out
        var type1 = document.getElementById("type1").value;
        var type2 = document.getElementById("type2").value;
        var types = [];
        if (type1 === type2 && type1) types.push(type1);
        else {
          if (type1) types.push(type1);
          if (type2) types.push(type2);
        }
        
        // Grab text for poke-description
        var description = document.getElementById("poke-description").value;

        payload = {
          action: "pokemon", 
          name: name, 
          attack: attack, 
          defense: defense, 
          health: health, 
          speed: speed, 
          types: types,
          moves: moves, 
          locations: locations,
          description: description, 
          evolves_to: evolves_to,
          evolves_from: evolves_from
        }
        post(payload);
      } else window.alert("Evolutions cannot be the same Pokemon");
    } else window.alert("Please fill out all fields in Stats");
  });
}
