// Display buttons so they have innate grid-display, then hide
$( '.customBoardBtns' ).hide();
$( '.inGameBtns' ).hide();


const totalCells = 81;
const boardLength = Math.sqrt(totalCells); // 9
const blockLength = Math.sqrt(boardLength); // 3

let playBoard = {};
let playBoardCells = [];
let customBoard = {};
let custBoardCells = [];

function Cell() {
  this.solvedVal = '';
  this.cornerVals = '';
  this.centerVals = '';
  this.color = '#FFF4EC';
  this.solved = false;
  this.given = false;
  this.cell = '';
  this.addSolvedVal = function(num) {
      if (!this.given) {
        this.solvedVal = num;
        this.solved = true;
        $( this.cell ).children().hide();
        $( '.solvedVal', this.cell ).text(this.solvedVal).show();
      }
    };
  this.delVals = function() {
      if (!this.given) {
        if (this.solved) {
          this.solvedVal = '';
          this.solved = false;
          $( '.solvedVal', this.cell ).empty();
          $( this.cell ).children().show();
        } else {
          this.cornerVals = '';
          $( '.cornerVal', this.cell ).empty();
          this.centerVals = '';
          $( '.centerVal', this.cell).empty();
        }
      }
    };
  this.addCornerVal = function(num) {
      if (!this.solved) {
        let temp = AddNewNum2SortedString(this.cornerVals, String(num));
        if (temp.length < 5) {
          this.cornerVals = temp;
          for (j = 0; j < 4; j++) {
            if (j < this.cornerVals.length) {
              $( '.cornerVal-' + j, this.cell ).text(this.cornerVals[j]);
            } else {
              $( '.cornerVal-' + j, this.cell ).empty();
            }
          }
        }
      }
    };
  this.addCenterVal = function(num) {
      if (!this.solved) {
        this.centerVals = AddNewNum2SortedString(this.centerVals, String(num));
        $( '.centerVal', this.cell ).text(this.centerVals);
      }
    };
  this.addColor = function(newColor) {
      if (this.color == newColor) {
        this.color = '#FFF4EC';
        $( this.cell ).css('background-color', '#FFF4EC');
      }
      this.color = newColor;
      $( this.cell ).css('background-color', newColor);
    };
  this.addGivenVal = function(num) {
      this.solvedVal = num;
      this.solved = true;
      this.given = true;
      $( '.solvedVal', this.cell ).text(this.solvedVal);
      $( this.cell ).addClass('given');
    };
  this.restart = function() {
      this.color = '#FFF4EC';
      this.centerVals = this.cornerVals = '';
      $( '.cornerVal', this.cell ).empty();
      $( '.centerVal', this.cell ).empty();
      if ( !this.given ) {
        this.solvedVal = '';
        this.solved = false;
        $( '.solvedVal', this.cell ).empty();
      }
    };
  this.reset = function() {
      this.solvedVal = this.cornerVals = this.centerVals = '';
      this.solved = this.given = false;
      this.color = '#FFF4EC';
      $( this.cell ).children().empty();
      $( this.cell ).removeClass('given');
    }
}

for (i = 0; i < totalCells; i++) {
  let cell = new Cell();
  let cell2 = new Cell();
  cell.cell = cell2.cell = '#cell-' + i;
  playBoardCells.push(cell);
  custBoardCells.push(cell2);
}

// Create sudoku board
if ( document.getElementById('sudoku') ) {
  for (i = 0; i < boardLength; i++) {
    const sudokuRow = document.createElement('div');
    sudokuRow.classList.add('sudokuRow', 'grid-container');

    for (j = 0; j < boardLength; j++) {
      let ind = (i*boardLength + j);
      const sudokuCell = document.createElement('div');
      sudokuCell.id = 'cell-' + ind;
      sudokuCell.classList.add('flex-container', 'cell', 'unselectable');
      sudokuCell.dataset.index = ind;

      // Add borders
      if ( ind < boardLength ) {
        sudokuCell.classList.add('Tborder-o');
      } else if ( ind >= totalCells - boardLength ) {
        sudokuCell.classList.add('Bborder-o');
      } else if ( ind % (boardLength * blockLength)  >= (boardLength * blockLength - boardLength) ) {
        sudokuCell.classList.add('Bborder-i');
      } else if ( ind % (boardLength * blockLength) < boardLength ) {
        sudokuCell.classList.add('Tborder-i');
      }
      
      if ( ind % boardLength === 0 ) {
        sudokuCell.classList.add('Lborder-o');
      } else if ( (ind + 1) % boardLength === 0 ) {
        sudokuCell.classList.add('Rborder-o');
      } else if ( ind % blockLength === 0 ) {
        sudokuCell.classList.add('Lborder-i');
      } else if ( (ind + 1) % blockLength === 0 ) {
        sudokuCell.classList.add('Rborder-i');
      }

      for (k = 0; k < 4; k++) {
        const cornerValHolder = document.createElement('span');
        cornerValHolder.classList.add('cornerVal', 'cornerVal-' + k, 'flex-container', 'cellContainer');

        sudokuCell.appendChild(cornerValHolder);
      }

      const solvedValHolder = document.createElement('span');
      solvedValHolder.classList.add('solvedVal', 'flex-container', 'cellContainer');

      const centerValHolder = document.createElement('span');
      centerValHolder.classList.add('centerVal', 'flex-container', 'cellContainer');
      
      sudokuCell.appendChild(centerValHolder);
      sudokuCell.appendChild(solvedValHolder);
      sudokuRow.appendChild(sudokuCell);
    }

    document.getElementById('sudoku').appendChild(sudokuRow);
  }

  PopulateRandomBoard();
};


function PopulateRandomBoard() {
  $.ajax({
    type: 'GET',
    url: '/randomBoard',
    success: function(board) {
      if (playBoard._id == board._id) {
        PopulateRandomBoard();
      } else {
        playBoard = board;
        for (i = 0; i < totalCells; i++) {
          let value = playBoard.givens[i];
          if (value >= 1 && value <= 9 && Number.isInteger(value)) {
            playBoardCells[i].addGivenVal(value);
          }
        }
      }
    }
  });
}

function AddNewNum2SortedString(string, num) {
  if (string.length) {
    for (i = 0; i < string.length; i++) {
      if ( string[i] > num) {
        if (i == 0) {
          return num + string;
        }
        return string.slice(0, i) + num + string.slice(i, string.length);
      } else if ( string[i] == num) {
        return string.slice(0, i) + string.slice(i+1, string.length);
      }
    }
    return string + num;
  } 
  return num;
}



// Make icon buttons squares
updateHeight();
$( window ).resize(updateHeight);

function updateHeight()
{
  const div = $('.iconBtn');
  let height = div.height();
  
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

  /*--------------------------------- Keyboard Functionality ---------------------------------*/
  $( document ).keydown(function (event) {
    if ( event.keyCode == 46 || event.keyCode == 8 ) {    // del/backspace
      populateSelectedCells('delete');
    } 
    else if ( (event.keyCode >= 49 && event.keyCode <= 57) || (event.keyCode >= 97 && event.keyCode <= 105) ) {   // numpads
     fillBasedOnNumpadMode($( 'numpad-' + event.key ), event.key);
    } 
    else if ( event.keyCode >= 37 && event.keyCode <= 40 ) {   // arrow keys
      $( '.selected' ).each(function() {
        let newIndex = $( this ).data("index");
        let indexChange = 0;
        if ( event.keyCode == 37 ) {indexChange = -1}       // left arrow
        else if ( event.keyCode == 39 ) {indexChange = 1}   // right arrow
        else if ( event.keyCode == 38 ) {indexChange = -9}  // up arrow
        else {indexChange = 9}                            // down arrow

        let movedIndex = $( this ).data("index") + indexChange;
        if ( movedIndex < 0 ) {
          newIndex = movedIndex + totalCells;
        } else if ( movedIndex >= totalCells ) {
          newIndex = movedIndex - totalCells;
        } else {
          newIndex = movedIndex;
        }

        $( '#cell-' + newIndex ).addClass('selected');
        $( this ).removeClass('selected');
      });
    }
  });

  /*--------------------------------- Cell Selection/Deselection ---------------------------------*/
  $(function () {
    let isMouseDown = false;
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
      })
  });

  $( document ).mousedown(function (event) {
    if ( !$( event.target ).is('.cell, .btn, .numpadCont') ) {
      $( '.selected' ).removeClass('selected');
    }
    if ( !$( event.target ).is('.restart') && $( '.restart' ).hasClass('doubleCheck') ) {
      removeRestartDC();
    }
    if (!$( '.custBoardSub' ).is(':hidden')) {
      $( '.custBoardSub' ).hide();
    }
    $( '.incorrect' ).removeClass('incorrect');
  });


  /*--------------------------------- Buttons ---------------------------------*/  
  // homePageBtns
  $( '.homeBtn' ).click(function() {
    if ( !$( '.homePageBtns' ).hasClass('currentGridMenu') ) {
      let flag = false;
      if ($( '.customBoardBtns' ).hasClass('currentGridMenu')) {
        $( '.cell' ).children().fadeOut('slow');
        flag = true;
      }
      $( '.cell' ).addClass('unselectable');
      $( '.currentGridMenu').fadeOut('slow')
      .promise().done(function() {
        $( '.currentGridMenu' ).removeClass('currentGridMenu');
        $( '.homePageBtns' ).addClass('currentGridMenu');
        $( '.homePageBtns' ).fadeIn('slow');
        if (flag) {
          toggleWorkingBoard(playBoardCells);
        }
        changeNumpadMode($('.normal'));
      })
    }
  });

  $( '.playGiven' ).click(function() {
    if ( $( '.homePageBtns' ).hasClass('currentGridMenu') ) {
      $( '.cell' ).removeClass('unselectable');
      $( '.homePageBtns' ).fadeOut('slow').removeClass('currentGridMenu')
      .promise().done(function() {
        $( '.inGameBtns' ).fadeIn('slow').addClass('currentGridMenu')
      })
    }
  });

  $( '.newRandomBoard' ).click(function() {
    if ( $( '.homePageBtns' ).hasClass('currentGridMenu') ) {
      playBoardCells.forEach(function(value) {
        value.reset();
      });
      PopulateRandomBoard();
    }
  });

  $( '.customBoard' ).click(function() {
    if ( $( '.homePageBtns' ).hasClass('currentGridMenu') ) {
      $( '.cell' ).children().fadeOut('slow');
      $( '.cell' ).removeClass('unselectable');
      $( '.homePageBtns' ).fadeOut('slow').removeClass('currentGridMenu')
      .promise().done(function() {
        $( '.customBoardBtns' ).fadeIn('slow').addClass('currentGridMenu');
        toggleWorkingBoard(custBoardCells);
      })
    }
  });

  // inGameBtns/customBoardBtns
  $( '.numpadMode' ).click(function() {
    changeNumpadMode($(this));
  });

  $( '.numpad' ).click(function() {
    fillBasedOnNumpadMode($( this ), $( this ).data('num'));
  });

  $( '.delete' ).click(function() {
    populateSelectedCells('delete');
  });

  $( '.restart' ).click(function() {
    if ( $( this ).hasClass('doubleCheck') ) {
      removeRestartDC();
      const workingBoard = getCurrentWorkingBoard();
      workingBoard.forEach(function(value) {
        value.restart();
      })
    } else {
      $( this ).addClass('doubleCheck');
      $( this ).html('Are you sure?');
    }
  });

  $( '.check' ).click(function() {
    if (markIncorrectCells(playBoard, playBoardCells)) {
      alert('Looks good!');
    } else {
      alert('Incorrect, please try again!')
    }
  });

  $( '.submitCustomBoard' ).click(function() {
    let grid = [];
    for (i = 0; i < totalCells; i++) {
      let cellVal = custBoardCells[i].solvedVal;
      if (cellVal)
        grid.push(cellVal);
      else
        grid.push(0);
    }
    console.log(grid);
    $.ajax({
      type: 'POST',
      url: '/uniqueSolution',
      dataType: 'json',
      data: { sudoku: grid },
      traditional: true,
      success: function(res) {
        console.log(res)
        if (res.error) {
          toggleCustomBoardSub(`Error uploading board to database. Please try again. Error Message: ${res.error}`, 0);
        }
        if (!res.numSolutions) {
          toggleCustomBoardSub('This sudoku has 0 solutions. Please try again.', 0);
        } else if (res.numSolutions == 1) {
          toggleCustomBoardSub('Thanks for uploading a sudoku. Have fun solving!', 1);
          playBoard = res.board;
          
          custBoardCells.forEach(function(value, index) {
            playBoardCells[index].reset();
            const num = value.solvedVal;
            if (num) {
              playBoardCells[index].addGivenVal(num);
            }
            value.reset();
          })

          $( '.customBoardBtns' ).fadeOut('slow').removeClass('currentGridMenu')
          .promise().done(function() {
            $( '.inGameBtns' ).fadeIn('slow').addClass('currentGridMenu')
            toggleWorkingBoard(playBoardCells);
          })
        } else if (res.numSolutions == 50) {
          toggleCustomBoardSub(`This sudoku has over ${res.numSolutions} solutions. Please try again.`, 0);
        } else {
          toggleCustomBoardSub(`This sudoku has ${res.numSolutions} solutions. Please try again.`, 0);
        }
      }
    });
  });

  // 404 Error Page
  $( '.goHomeButton404' ).click(function() {
    window.location.href='/';
  });


  /*--------------------------------- Helper Functions ---------------------------------*/
  function fillBasedOnNumpadMode(object, num) {
    if ( $( '.normal' ).hasClass('currentNumpadMode') ) {
      populateSelectedCells('solvedVal', num);
    } else if ( $( '.corner' ).hasClass('currentNumpadMode') ) {
      populateSelectedCells('cornerVal', num);
    } else if ( $( '.center' ).hasClass('currentNumpadMode') ) {
      populateSelectedCells('centerVal', num);
    } else if ( $( '.color' ).hasClass('currentNumpadMode') ) {
      populateSelectedCells('colorVal', object.data('color'));
    }
  }
  
  function populateSelectedCells(type, num = '') {
    const workingBoard = getCurrentWorkingBoard();
    $( '.selected' ).each(function() {
      const ind = $( this ).data('index');
      if (type == 'givenVal') {
        workingBoard[ind].addGivenVal(num);
      } else if (type == 'solvedVal') {
        workingBoard[ind].addSolvedVal(num);
      } else if (type == 'cornerVal') {
        workingBoard[ind].addCornerVal(num);
      } else if (type == 'centerVal') {
        workingBoard[ind].addCenterVal(num);
      } else if (type == 'colorVal') {
        workingBoard[ind].addColor(num)
      } else if (type == 'delete') {
        workingBoard[ind].delVals();
      }
    })
  };

  function removeNumpadClasses() {
    $( '.numpadCont' ).removeClass('numpadCenter numpadCorner numpadColor');
  }

  function removeRestartDC() {
    $( '.restart' ).addClass('immediateTransition');
    $( '.restart' ).removeClass('doubleCheck');
    $( '.restart' ).html('Restart');
    setTimeout(function() {
      $( '.immediateTransition' ).removeClass('immediateTransition');
    }, 25);
  }
  
  function markIncorrectCells(board, currCells) {
    flag = true;
    currCells.forEach(function(value, index) {
      if (value.solvedVal != board.solution[index]) {
        $( value.cell ).addClass('incorrect');
        flag = false;
      }
    })
    return flag;
  }

  function changeNumpadMode(newMode) {
    if ( !newMode.hasClass('currentNumpadMode') ) {
      $( '.currentNumpadMode' ).addClass('btn immediateTransition').removeClass('currentNumpadMode');
      newMode.addClass('currentNumpadMode');
      newMode.removeClass('btn');
      if ( newMode.hasClass('normal') ) {
        removeNumpadClasses();
      } else if ( newMode.hasClass('corner') ) {
        removeNumpadClasses();
        $( '.numpadCont' ).addClass('numpadCorner');
      } else if ( newMode.hasClass('center') ) {
        removeNumpadClasses();
        $( '.numpadCont' ).addClass('numpadCenter');
      } else if ( newMode.hasClass('color') ) {
        removeNumpadClasses();
        $( '.numpadCont' ).addClass('numpadColor').css('color', );
      }
    }
  }

  function getCurrentWorkingBoard() {
    if ($( '.customBoardBtns' ).hasClass('currentGridMenu')) {
      return custBoardCells;
    }
    return playBoardCells;
  }

  function toggleWorkingBoard(newWorkingBoard) {
    $( '.cell' ).children().empty();
    $( '.given' ).removeClass('given');
    newWorkingBoard.forEach(function(value) {
      for (i = 0; i < value.cornerVals.length; i++) {
        $( '.cornerVal-' + i, value.cell ).text(value.cornerVals[i]);
      }
      $( '.centerVal', value.cell ).text(value.centerVals);
      if (value.given) {
        value.addGivenVal(value.solvedVal);
        $( '.solvedVal', value.cell ).fadeIn('slow');
      } else if (value.solved) {
        $( '.solvedVal', value.cell ).text(value.solvedVal).fadeIn('slow');
      } else {
        $( value.cell ).children().fadeIn('slow');
      }
    })
    
  }

  function toggleCustomBoardSub(message, status) {
    if (!$( '.custBoardSub' ).is(':hidden')) {
      $( '.custBoardSub' ).hide();
    } else {
      if (status)
        $( '.custBoardMessageIcon' )
          .removeClass('fa-times')
          .addClass('fa-check')
          .css('color', 'green')
          .css('font-size','50px');
      else
        $( '.custBoardMessageIcon' )
          .removeClass('fa-check')
          .addClass('fa-times')
          .css('color', 'red')
          .css('font-size','50px');
      
      $( '.custBoardSubInnerMessage' ).html(message);
      $( '.custBoardSub' ).show();
    }
  }
  
});
