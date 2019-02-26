document.addEventListener("DOMContentLoaded", function(event) {
    
    // controls which form to display
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
    
    // binds controls to 'type' form
    document.getElementById("add-row-type").addEventListener("click", function(event) {

        // block of code to be inserted
        var codeBlock = 
          '<div class="col-sm-3">' + 
            '<div class="form-group">' + 
              '<input class="form-control" placeholder="grass">' +
            '</div>' +
          '</div>' +
          '<div class="col-sm-3">' +
            '<div class="form-group">' +
              '<input class="form-control" placeholder="fire">' +
            '</div>' +
          '</div>' +
          '<div class="col-sm-3">' +
            '<div class="form-group">' +
              '<input class="form-control" placeholder="flying">' +
            '</div>' +
          '</div>';

        // create new 'row' element, make its innerHTML equal to above code
        var newRow = document.createElement("div");
        newRow.className = "row";
        newRow.innerHTML = codeBlock;

        // insert newRow as second to last element in container
        var container = document.getElementById("container-type");
        console.log(container);
        container.insertBefore(newRow, container.lastElementChild);

    });
    
    // binds controls to 'move' form
    document.getElementById("add-row-move").addEventListener("click", function(event) {

        // block of code to be inserted
        var codeBlock = 
          '<div class="col-sm-3">' + 
            '<div class="form-group">' + 
              '<input class="form-control" placeholder="incinerate">' +
            '</div>' +
          '</div>' +
          '<div class="col-sm-3">' +
            '<div class="form-group">' +
              '<input class="form-control" placeholder="10">' +
            '</div>' +
          '</div>';

        // create new 'row' element, make its innerHTML equal to above code
        var newRow = document.createElement("div");
        newRow.className = "row";
        newRow.innerHTML = codeBlock;

        // insert newRow as second to last element in container
        var container = document.getElementById("container-move");
        console.log(container);
        container.insertBefore(newRow, container.lastElementChild);

    });
});


// // CODE FOR CAROUSEL******************************************************
// var slideIndex = 1;
// showSlides(slideIndex);

// // next/previous controls
// function plusSlides(n) {
//     showSlides(slideIndex += n);
// }

// // thumbnail image controls
// function currentSlide(n) {
//     showSlides(slideIndex = n);
// }

// // will show slide of entered index n
// function showSlides(n) {
//     var i;
//     var slides = document.getElementsByClassName("mySlides");
//     var dots = document.getElementsByClassName("dot");
//     if (n > slides.length) {slideIndex = 1}
//     if (n < 1) {slideIndex = slides.length}
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for (i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//     }
//     slides[slideIndex-1].style.display = "block";
//     dots[slideIndex-1].className += " active";
// }


