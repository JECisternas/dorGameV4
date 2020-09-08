const board = document.getElementById('id-board')
let className
let colorPlayer = 'rgb(72, 209, 204)' 
let colorBoard = 'rgb(250, 250, 250)'
let colorPlayer1 = 'rgb(72, 209, 204)'
let colorPlayer2 = 'rgb(255, 165, 0)'
let coord = ''
let countPlayer1 = 0, countPlayer2 = 0
let maxJ
let squaresClaimed = 0
let topG,leftG
let totalsquaresClaimed = 0
let num_of_players = 1
let intervalo_2000
const socket = io()  ///  VER PORQUE NO FNCIONA EN LA REAL WEB
// listening sockets  ========================================================================
socket.on('paint:color', function (data) {
  let ele = document.getElementById(`${data.id}`)
  ele.style.background = `${data.color}`
})
socket.on('paint:color_square', function (data) {
  let ele = document.getElementById(`${data.id}`)
  ele.style.background = `${data.color}`
})
socket.on('change_remote_color2', function (data) {
  colorPlayer = `${data}`
})
socket.on('change_remote_color1', function (data) {
  colorPlayer= `${data}`
})
socket.on('score', function (data) {
  document.getElementById('div-player1').innerHTML = `${data.sqr1}`
  document.getElementById('div-player2').innerHTML = `${data.sqr2}`
  countPlayer1 = `${data.sqr1}`
  countPlayer2 = `${data.sqr2}`
})
// ===========================================================================================
// Draws rectangles and squares  --------------------------------------
/*  Groups of rectangles have a similar behavior to be processed:
      Group 1: Horizontal rectangles in the row on the top of the board     (t-h-r)
      Group 2: Horizontal rectangles in the row on the bottom of the board  (b-h-r)
      Group 3: Horizontal rectangles in the middle area of the board        (m-h-r)
      Group 4: Vertical rectangles in the column on the left of the board   (l-v-r)
      Group 5: Vertical rectangles in the column on the right of the board  (r-v-r)
      Group 6: Vertical rectangles in the middle area of the board          (m-v-r)
*/

let rect = (max,h,w,or) => {
  if (or === 'hor'){
    maxJ = max - 1      // to control the last row on the bottom of the board
    topG = 4, leftG = 22   // Starting point, for horizontal rectangles
  }else if( or === 'ver'){
    maxJ = max + 1      // to control the last column on the right of the board
    topG = 22, leftG = 4   // Starting point, for vertical rectangles
  }else{  // squares
    maxJ = max
    topG = 22, leftG = 22   // Starting point, for squares
  }    

  for(let j = 1; j<= maxJ; j++){ 
    for(let i = 1; i<=max; i++){
      if     (or === 'hor' && i === 1){className = 'top-hor-rect'}
      else if(or === 'hor' && i === max){className = 'bottom-hor-rect'}
      else if(or === 'ver' && j === 1){className = 'left-ver-rect'}
      else if(or === 'ver' && j === maxJ){className = 'right-ver-rect'}
      else if(or === 'hor' && i !== 1 && i !== max){className = 'middle-hor-rect'}
      else if(or === 'ver' && j !== 1 && j !== maxJ){className = 'middle-ver-rect'}
      else if(or === 'sqr'){className = 'squares'}

      coord = i + '' + j  // Makes the "id" unique for every rectangle and square. It will be contatenated with a prefix
      // eval lets work the name of variables as a variable
      eval('let rectangle' + coord )  // Different variables are necessary to create diferent Elements   
      let varName = `rectangle${coord}` // Variable with variable name
      eval(varName + '= document.createElement("div")')
      eval(varName + '.style.height = "'  +  h + 'px' + '"')
      eval(varName + '.style.width ="'  +  w + 'px' + '"')
      eval(varName + '.style.border = "1px solid black" ')
      if(or === 'sqr'){
        eval(varName + '.style.background = "rgba(220, 240, 230, .5)" ')
      }else{
        eval(varName + '.style.background = "rgb(250, 250, 250)" ')
      }
      eval(varName + '.style.position = "absolute" ')
      eval(varName + '.style.left ="'  +  leftG + 'px' + '"')
      eval(varName + '.style.top = "'  +  topG + 'px' + '"')
      eval(varName + '.classList = "' + className + '"')    
      if (or === 'hor'){
        eval(varName + '.id = "h' + coord + '"')    // h11, h12...h76
      }else if( or === 'ver'){
        eval(varName + '.id = "v' + coord + '"')    // v11, v12...v67
      }else{  // squares
        eval(varName + '.id = "s' + coord + '"')    // s11, s12...s66
      }  
      eval('board.appendChild(' + varName +')')
      topG += 56
    }
    if (or === 'hor'){
      topG = 4, leftG += 57
    }else if( or === 'ver'){
      topG = 22, leftG += 57
    }else{  // 'sqr'
      topG = 22, leftG += 57
    }     
  }
}
// -------------------------------------------------------------------------------
// Draws circles with clonation method.
// Clones the svg-template inside the HTML to append it into the id-board div
coord = ''
leftG = 10
const template = document.getElementById('svg-template')
const newTemplate = template.content.cloneNode(true)
board.appendChild(newTemplate)
// Gets the circle element inside the svg element inside the svg-template to clone it
let coll_cir_idsvg = document.getElementsByTagName('circle')
let cir =  coll_cir_idsvg[0]

 // Clones and draws every circle
 // TIP: cloneNode(true) must be done for every clonation
let circles = (max,d) => {
  for(let j = 1; j<= max; j++){ 
    topG = 10
    for(let i = 1; i<= max; i++){
      coord = i + '' + j
      let newCir = `newCir${coord}`
      let newCirClone = `cirClone${coord}`
      eval(newCirClone + '= cir.cloneNode(true)')
      eval(newCir + '= document.getElementById("id-svg").appendChild(' + newCirClone+ ')')
      eval(newCir + '.setAttribute("cx","' + leftG +'")')
      eval(newCir + '.setAttribute("cy","' + topG +'")')

      topG += 56
    }
    leftG += 57 
   }
 }
 //---------------------------------------------------------------------------------


// Draws circles
circles(7,20)
// Draws horizontal rectangles
rect(7,15,36,'hor')
// Draws vertical rectangles
rect(6,35,15,'ver')
// Draws squares
rect(6,35,36,'sqr')


//---------------------------------------------------------------------------------
// Detects the rectangles where the click was done and the group to which it belongs
document.getElementById('id-board').addEventListener('click', e => {
  let elementClicked = e.target
  if(elementClicked.className === 'top-hor-rect'){claimRect(elementClicked.id,'claimSquare_t_h_r')}
    else if (elementClicked.className === 'bottom-hor-rect'){claimRect(elementClicked.id,'claimSquare_b_h_r')}
    else if (elementClicked.className === 'middle-hor-rect'){claimRect(elementClicked.id,'claimSquare_m_h_r')}
    else if (elementClicked.className === 'left-ver-rect'){claimRect(elementClicked.id,'claimSquare_l_v_r')}
    else if (elementClicked.className === 'right-ver-rect'){claimRect(elementClicked.id,'claimSquare_r_v_r')}
    else if (elementClicked.className === 'middle-ver-rect'){claimRect(elementClicked.id,'claimSquare_m_v_r')}
})
//---------------------------------------------------------------------------------------------
// Checks if the rectangle has not been claimed yet. if not, it is claimed by the player
function claimRect(id,claimSquare){
  let element = document.getElementById(id)  
  let color = element.style.backgroundColor
  if( color === colorBoard){   //'not assigned'
      if(colorPlayer === colorPlayer1){
        element.style.backgroundColor = colorPlayer1  // Rectangle claimed by player1
        socket.emit('paint:color1', {id: id, color: colorPlayer1}) // to paint the rect claimed en el oponnente
        if (eval('!' + claimSquare + '(id, "rgb(72, 209, 204)")')){
          socket.emit('change_remote_color2', colorPlayer2)  // to change the color for the remote oponnent
        }
      }else{
        element.style.backgroundColor = colorPlayer2  // Rectangle claimed by player2
        socket.emit('paint:color2', {id: id, color: colorPlayer2})
        
        if (eval('!' + claimSquare + '(id, "rgb(255, 165, 0)")')){
          socket.emit('change_remote_color1', colorPlayer1)  // to change the color for the remote oponnent
        }  
      }
  }
}
// ===========================================================================================
// Checks if the claimed rectangle has to claim any adjacent square
function claimSquare_t_h_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  const id_square = 's'+id_xy
  if (document.getElementById(`v${id_xy}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      socket.emit('paint:color_t_h_r', {
        id: id_square,
        color: color
      })
      score(color)
      return true
  }else{
      return false
  }
}
//--------------------------------------------------------------------------------------------
function claimSquare_b_h_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  const id_square = 's'+(id_xy - 10)
  if (document.getElementById(`v${id_xy - 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 9}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy - 10}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 10}`).style.background = color
      socket.emit('paint:color_b_h_r', {
        id: id_square,
        color: color
      })
      score(color)
      return true
  }else{
      return false
      }
}
//--------------------------------------------------------------------------------------------
function claimSquare_m_h_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  let id_square
  let count = 0
  if (document.getElementById(`h${id_xy - 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 9}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 10}`).style.background = color
      id_square = 's'+(id_xy - 10)
      socket.emit('paint:color_m_h_r', {
        id: id_square,
        color: color
      })
      count++
      score(color)
    }
  if (document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      id_square = 's'+(id_xy)
      socket.emit('paint:color_m_h_r', {
        id: id_square,
        color: color
      })
      count++
      score(color)
    } 
  if(count > 0){return true}  else {return false}
}
//--------------------------------------------------------------------------------------------
function claimSquare_l_v_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  const id_square = 's'+id_xy
  if (document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      socket.emit('paint:color_l_v_r', {
        id: id_square,
        color: color
      })
      score(color)
      return true
    }else{
      return false
      }
}
//--------------------------------------------------------------------------------------------
function claimSquare_r_v_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  const id_square = 's'+(id_xy - 1)
  if (document.getElementById(`v${id_xy - 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy - 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 9}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 1}`).style.background = color
      socket.emit('paint:color_r_v_r', {
        id: id_square,
        color: color
      })
      score(color)
      return true
  }else{
      return false
      }
}
//--------------------------------------------------------------------------------------------
function claimSquare_m_v_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  let id_square
  let count = 0
  if (document.getElementById(`h${id_xy - 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 9}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 1}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 1}`).style.background = color
      id_square = 's'+(id_xy - 1)
      socket.emit('paint:color_m_v_r', {
        id: id_square,
        color: color
      })
      count++
      score(color)
    }
  if (document.getElementById(`h${id_xy}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      id_square = 's'+id_xy
      socket.emit('paint:color_m_v_r', {
        id: id_square,
        color: color
      })
      count++
      score(color)
    } 
   if(count > 0){return true}  else {return false}
}
// ===========================================================================================

function showscore(count1, count2){
  let score1, score2
  socket.emit('score', {sqr1: count1, sqr2: count2})  
  
  if(totalsquaresClaimed === 36){ //game over
    let gameOver = document.getElementById('id-board')
    gameOver.style.background = '#EAFAF1'
    score1 = document.getElementById('div-player1')
    score2 = document.getElementById('div-player2')

    if (SquaresClaimed_1 > SquaresClaimed_2){
      intervalo_2000 = setInterval(() => { 
        if (score1.style.fontSize === '30px') {
          score1.style.fontSize = '45px' 
        }else{
          score1.style.fontSize = '30px' 
        }
      }, 1000);
    }else{
      intervalo_2000 = setInterval(() => { 
        if (score2.style.fontSize === '30px') {
          score2.style.fontSize = '45px' 
        }else{
          score2.style.fontSize = '30px' 
        }
      }, 1000);
    }
  }
}
// ===========================================================================================
const btnRestart = document.getElementById("id-btn-close")
btnRestart.addEventListener('click', () => {
clearInterval(intervalo_2000)
window.location.reload()
})

// ===========================================================================================
function score(color){
if (color === colorPlayer1){
  countPlayer1++
}else{
  countPlayer2++
}
showscore(countPlayer1,countPlayer2)
}