// Display buttons so they have innate grid-display, then hide
$( '.customBoardBtns' ).hide();
$( '.inGameBtns' ).hide();


var totalCells = 81;
var boardLength = Math.sqrt(totalCells); // 9
var cellLength = Math.sqrt(boardLength); // 3

var cellValues = [];
cellValues.length = totalCells;
cellValues.fill(0);

// Create sudoku board
if (document.getElementById('sudoku')) {
  for (i = 0; i < boardLength; i++) {
    var sudokuRow = document.createElement('div');
    sudokuRow.classList.add('sudokuRow', 'grid-container');

    for (j = 0; j < boardLength; j++) {
      let ind = (i*boardLength + j);
      var sudokuCell = document.createElement('div');
      sudokuCell.id = 'cell-' + ind;
      sudokuCell.classList.add('flex-container', 'cell');
      sudokuCell.dataset.index = ind;

      // Add borders
      if (ind < boardLength) {
        sudokuCell.classList.add('Tborder-o');
      } else if (ind >= totalCells - boardLength) {
        sudokuCell.classList.add('Bborder-o');
      } else if ((ind % (boardLength * cellLength)) >= (boardLength * cellLength - boardLength)) {
        sudokuCell.classList.add('Bborder-i');
      } else if ((ind % (boardLength * cellLength)) < (boardLength)) {
        sudokuCell.classList.add('Tborder-i');
      }
      
      if (ind % boardLength === 0) {
        sudokuCell.classList.add('Lborder-o');
      } else if ((ind + 1) % boardLength === 0) {
        sudokuCell.classList.add('Rborder-o');
      } else if (ind % cellLength === 0) {
        sudokuCell.classList.add('Lborder-i');
      } else if ((ind+1) % cellLength === 0) {
        sudokuCell.classList.add('Rborder-i');
      }
      
      sudokuRow.appendChild(sudokuCell);
    }

    document.getElementById('sudoku').appendChild(sudokuRow);
  }
}



// Make icon buttons squares
updateHeight();
$( window ).resize(updateHeight);

function updateHeight()
{
  var div = $('.iconBtn');
  var height = div.height();
  
  div.css('width', height);
}

$( 'button' ).addClass('btn');

// No transition animation when button clicked
$( '.btn' ).mousedown(function() {
  $( this ).addClass('immediateTransition');
});
$( '.iconBtn' ).mousedown(function() {
  $( this ).addClass('immediateTransition');
});
$( document ).mouseup(function () {
  setTimeout(function() {
    $( '.immediateTransition' ).removeClass('immediateTransition');
  }, 25);
});

$ ( '.currentNumpadMode' ).removeClass('btn');



$(document).ready(function(){

  // Keyboard functionality
  $( document ).keydown(function (event) {
    if (event.keyCode == 46 || event.keyCode == 8) {    // del/backspace
      $( '.selected' ).html('');
      updateCellValues('');
    } else if ((event.keyCode >= 49 && event.keyCode <= 57) || (event.keyCode >= 97 && event.keyCode <= 105)) {   //numpads
      $( '.selected' ).html(event.key);
    } else if (event.keyCode >= 37 && event.keyCode <= 40) {       // arrow keys
      $( '.selected' ).each(function() {
        let newIndex = $( this ).data("index");
        let indexChange = 0;
        if (event.keyCode == 37) {indexChange = -1}       // left arrow
        else if (event.keyCode == 39) {indexChange = 1}   // right arrow
        else if (event.keyCode == 38) {indexChange = -9}  // up arrow
        else {indexChange = 9}                            // down arrow

        let movedIndex = $( this ).data("index") + indexChange;
        if (movedIndex < 0) {
          newIndex = movedIndex + totalCells;
        } else if (movedIndex >= totalCells) {
          newIndex = movedIndex - totalCells;
        } else {
          newIndex = movedIndex;
        }

        $( '#cell-' + newIndex ).addClass('selected');
        $( this ).removeClass('selected');
      });
    }
  });

  // *** select and deselect cells ***
  $(function () {
    var isMouseDown = false;
    $( '.cell' )
      .mousedown(function (event) {
        isMouseDown = true;
        if (!event.ctrlKey) {
          $( '.selected' ).removeClass('selected');
        }
        $( this ).addClass('selected');
      })
      .mouseover(function () {
        if (isMouseDown) {
          $(this).addClass('selected');
        }
      })

    $( document )
      .mouseup(function () {
        isMouseDown = false;
      });
  });

  // deselect cells when not clicking a cell or button
  $( document ).mousedown(function (event) {
    if (!$( event.target ).is('.cell, .btn')) {
      $( '.selected' ).removeClass('selected');
    }
  });

  // Update cellValues array
  function updateCellValues(num) {
    var flag = false;

    $( '.selected' ).each(function() {
      $( this ).html(num);

      if (isNaN(Number($( this ).html()) && num != '')) {
        console.log('Cells only accept 1-9 as values')
      } else if ($( this ).data('oldVal') != $( this ).html()) {
        flag = true;
        // Updated stored value
        $( this ).data('oldVal', $( this ).html());

        cellValues[$( this ).data('index')] = Number($( this ).data('oldVal'));
      }
    });
    if (flag) {
      console.log(cellValues);
    }
  }

  $('.cell').each(function() {
    // Save current value of element
    $( this ).data('oldVal', $( this ).html());

    // Look for changes in the value
    $( this ).on('propertychange change click keyup input paste', function(event){
      updateCellValues($( this ).val());
    });
  });


  // *** home-page buttons ***
  $( '.homeBtn' ).click(function() {
    if (!$( '.homePageBtns' ).hasClass('currentGridMenu')) {
      $( '.currentGridMenu').fadeOut('slow')
      .promise().done(function() {
        $( '.currentGridMenu' ).removeClass('currentGridMenu');
        $( '.homePageBtns' ).addClass('currentGridMenu')
        $( '.homePageBtns' ).fadeIn('slow')
      })
    }
  });

  $( '.customBoard' ).click(function() {
    if ($( '.homePageBtns' ).hasClass('currentGridMenu')) {
      $( '.homePageBtns' ).fadeOut('slow').removeClass('currentGridMenu')
      .promise().done(function() {
        $( '.customBoardBtns' ).fadeIn('slow').addClass('currentGridMenu')
      })
    }
  });

  $( '.playGiven' ).click(function() {
    if ($( '.homePageBtns' ).hasClass('currentGridMenu')) {
      $( '.homePageBtns' ).fadeOut('slow').removeClass('currentGridMenu')
      .promise().done(function() {
        $( '.inGameBtns' ).fadeIn('slow').addClass('currentGridMenu')
      })
    }
  });


  // *** in-game-btns ***
  $( '.numpadMode' ).click(function() {
    if (!$( this ).hasClass('currentNumpadMode')) {
      $( '.currentNumpadMode' ).addClass('btn immediateTransition').removeClass('currentNumpadMode');
      $( this ).addClass('currentNumpadMode');
      $( this ).removeClass('btn');
    }
  });

  $( '.numpad' ).click(function() {
    var num = $( this ).data('num');
    updateCellValues(num);
    return false;
  });

  $( '.delete' ).click(function() {
    $( '.selected' ).html('');
    return false;
  });

  // 404 Error Page
  $( '.goHomeButton404' ).click(function() {
    window.location.href='/';
  });


  // REST API
  $.ajax({
    type: 'GET',
    url: '',
    success: function (){

    }
  });

});


