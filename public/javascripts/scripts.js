// Display buttons so they have innate grid-display, then hide
$( ".customBoardBtns" ).hide();
$( ".inGameBtns" ).hide();

// Make icon buttons squares
updateHeight();
$( window ).resize(updateHeight);

function updateHeight()
{
  var div = $(".iconBtn");
  var height = div.height();
  
  div.css('width', height);
}

$( "button" ).addClass("btn");

// Immediate button style change when clicked
$( ".btn" ).mousedown(function() {
  $( this ).addClass("immediateTransition");
});
$( ".iconBtn" ).mousedown(function() {
  $( this ).addClass("immediateTransition");
});
$( document ).mouseup(function () {
  setTimeout(function() {
    $( ".immediateTransition" ).removeClass("immediateTransition");
  }, 25);
});

$ ( ".currentNumpadMode" ).removeClass("btn");


var totalCells = 81;
var boardLength = Math.sqrt(totalCells); // 9
var cellLength = Math.sqrt(boardLength); // 3

var cellValues = [];
cellValues.length = totalCells;
cellValues.fill(0);


// Adds class names to sudoku cells
$( function() {
  for (i = 0; i < totalCells; i++) {
    var cell = ".sudoku input:nth-child(" + (i+1) + ")";
    $( cell ).addClass("cell");
    $( cell ).attr("id", "cell-" + i);
    $( cell ).attr("maxlength", "1");
    $( cell ).attr("data-index", i);

    if (i < boardLength) {
      $( cell ).addClass("Tborder-o");
    } else if (i >= totalCells - boardLength) {
      $( cell ).addClass("Bborder-o");
    } else if ((i % (boardLength * cellLength)) >= (boardLength * cellLength - boardLength)) {
      $( cell ).addClass("Bborder-i");
    } else if ((i % (boardLength * cellLength)) < (boardLength)) {
      $( cell ).addClass("Tborder-i");
    }
    
    if (i % boardLength === 0) {
      $( cell ).addClass("Lborder-o");
    } else if ((i + 1) % boardLength === 0) {
      $( cell ).addClass("Rborder-o");
    } else if (i % cellLength === 0) {
      $( cell ).addClass("Lborder-i");
    } else if ((i+1) % cellLength === 0) {
      $( cell ).addClass("Rborder-i");
    }

  }
});



$(document).ready(function(){

  // Keyboard functionality
  $( document ).keydown(function (event) {
    if (event.keyCode == 46 || event.keyCode == 8) {
      $( ".selected" ).val("");
      updateCellValues("");
    } else if ((event.keyCode >= 49 && event.keyCode <= 57) || (event.keyCode >= 97 && event.keyCode <= 105)) {
      $( ".selected" ).val(event.key);
    }
  });

  // *** select and deselect cells ***
  $(function () {
    var isMouseDown = false;
    $( ".cell" )
      .mousedown(function (event) {
        isMouseDown = true;
        if (!event.ctrlKey) {
          $( ".selected" ).removeClass("selected");
        }
        $( this ).addClass("selected");
      })
      .mouseover(function () {
        if (isMouseDown) {
          $(this).addClass("selected");
        }
      })

    $( document )
      .mouseup(function () {
        isMouseDown = false;
      });
  });

  // deselect cells when not clicking a cell or button
  $( document ).click(function (event) {
    if (!($( event.target ).closest(".cell").length)) {
      $( ".selected" ).removeClass("selected");
    }
  });

  // Update cellValues array
  function updateCellValues(num) {
    var flag = false;

    $( ".selected" ).each(function() {
      $( this ).val(num);

      if (isNaN(Number($( this ).val()) && num != '')) {
        console.log('Cells only accept 1-9 as values')
      } else if ($( this ).data('oldVal') != $( this ).val()) {
        flag = true;
        // Updated stored value
        $( this ).data('oldVal', $( this ).val());

        cellValues[$( this ).data('index')] = Number($( this ).data('oldVal'));
      }
    });
    if (flag) {
      console.log(cellValues);
    }
  }

  $('.cell').each(function() {
    // Save current value of element
    $( this ).data('oldVal', $( this ).val());

    // Look for changes in the value
    $( this ).on("propertychange change click keyup input paste", function(event){
      // If value has changed...
      updateCellValues($( this ).val());
    });
  });


  // *** home-page buttons ***
  $( ".homeBtn" ).click(function() {
    if (!$( ".homePageBtns" ).hasClass("currentGridMenu")) {
      $( ".currentGridMenu").fadeOut("slow")
      .promise().done(function() {
        $( ".currentGridMenu" ).removeClass("currentGridMenu");
        $( ".homePageBtns" ).addClass("currentGridMenu")
          .promise().done(function() {
            $( ".homePageBtns" ).fadeIn("slow")
        })
      })
    }
  });

  $( ".customBoard" ).click(function() {
    if ($( ".homePageBtns" ).hasClass("currentGridMenu")) {
      $( ".homePageBtns" ).fadeOut("slow").removeClass("currentGridMenu")
      .promise().done(function() {
        $( ".customBoardBtns" ).fadeIn("slow").addClass("currentGridMenu")
      })
    }
  });

  $( ".playGiven" ).click(function() {
    if ($( ".homePageBtns" ).hasClass("currentGridMenu")) {
      $( ".homePageBtns" ).fadeOut("slow").removeClass("currentGridMenu")
      .promise().done(function() {
        $( ".inGameBtns" ).fadeIn("slow").addClass("currentGridMenu")
      })
    }
  });


  // *** in-game-btns ***
  $( ".numpadMode" ).click(function() {
    if (!$( this ).hasClass("currentNumpadMode")) {
      $( ".currentNumpadMode" ).addClass("btn immediateTransition").removeClass("currentNumpadMode");
      $( this ).addClass("currentNumpadMode");
      $( this ).removeClass("btn");
    }
  });

  $( ".numpad" ).click(function() {
    var num = $( this ).data("num");
    updateCellValues(num);
    return false;
  });

  $( ".delete" ).click(function() {
    $( ".selected" ).val("");
    return false;
  });

  // Restricts input for the given textbox to the given inputFilter function.
  function setInputFilter(textbox, inputFilter) {
      ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
          if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          } else {
            this.value = "";
          }
        });
      });
  }

  // Restricts input of all sudoku cells to 1-9
  for (l = 0; l < totalCells; l++) {
    if (document.getElementsByClassName('cell').length == 0) {
      break;
    } else {setInputFilter(document.getElementsByClassName('cell')[l], function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) > 0); });
    }
  }


  // 404 Error Page
  $( ".goHomeButton404" ).click(function() {
    window.location.href='/';
  });


  // REST API
  $.ajax({
    type: "GET",
    url: "",
    success: function (){

    }
  });

});


