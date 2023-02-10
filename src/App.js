import './App.css';
import React, { useState } from "react";
const init = [ 
  [-1, -1, -1, 2, 6, -1, 7, -1, 1],
  [6, 8, -1, -1, 7, -1, -1, 9, -1],
  [1, 9, -1, -1, -1, 4, 5, -1, -1],
  [8, 2, -1, 1, -1, -1, -1, 4, -1],
  [-1, -1, 4, 6, -1, 2, 9, -1, -1],
  [-1, 5, -1, -1, -1, 3, -1, 2, 8],
  [-1, -1, 9, 3, -1, -1, -1, 7, 4],
  [-1, 4, -1, -1, 5, -1, -1, 3, 6],
  [7, -1, 3, -1, 1, 8, -1, -1, -1]
]
// var initial=init;

// const initial=[initial1,initial2];

function App() {
  const [sudokuArr,setSudokuArr] = useState(getDeepCopy(init));

  function getDeepCopy(arr){
    return JSON.parse(JSON.stringify(arr));
  }
// console.log(sudokuArr[1][0])
// var grid = getDeepCopy(sudokuArr)
 function onInputChange(e,row,col){
   var val=parseInt(e.target.value) || -1 ;
   const grid = getDeepCopy(sudokuArr)
   //input value should be range from 1 to 9( (val>=1 && val<=9)) and for empty cell it should be -1(val === -1)(thts wht we have checked in if statement)
   if(val === -1 || (val>=1 && val<=9)){
     grid[row][col]=val;
   }
   setSudokuArr(grid);
 }

 //function to compare to sudokus
function compareSudokus(currentSudoku, solveSudoku){
  let res = {
    isComplete: true,
    isSolvable: true
  }
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      if(currentSudoku[i][j]!== solveSudoku[i][j]){
        if(currentSudoku[i][j]!==-1){
           res.isSolvable = false;
        }
        res.isComplete = false; 
      }
    }
  }
  return res;
}

//function to check whether sudoku is valid or not
 function checkSudoku(){
   let sudoku = getDeepCopy(init);
   solver(sudoku,0,0);
   let compare = compareSudokus(sudokuArr,sudoku);
   if(compare.isComplete){
     alert("Congo! you have solved the sudoku");
   }
   else if(compare.isSolvable){
    alert("keep going");
   }
   else{
    alert("sudoku cant be solved, try again");
   }
 }


  function checkRow(grid,row,num){
    return grid[row].indexOf(num) === -1;
  }
 
  //check num is unique in col
  function checkCol(grid,col,num){
    return grid.map(row => row[col]).indexOf(num) === -1;
  }

  //check num is unique in box
  function checkBox(grid,row,col,num){
    let boxArr = [];
    let rowStart = row - (row%3);
    let colStart = col - (col%3);
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        //get all the cell numbers and push to boxArr
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }
    return boxArr.indexOf(num) === -1;
  }

  function checkValid(grid,row,col,num){
    //num should be unique in row,col,and in the square 3*3
    if(checkRow(grid,row,num) && checkCol(grid,col,num) && checkBox(grid,row,col,num)){
       return true;
    }
    return false;
  }
function getNext(row,col){
  
 return col!== 8 ? [row,col+1] : row!==8 ? [row+1,0] : [0,0];
}

 //this function is to solve sudoku
 function solver(grid,row,col){

  //if the current cell is already filled, move to next cell
  if(grid[row][col] !==-1){
    //for last cell , do not solve it
    let isLast = row>=8 && col>=8;
    if(!isLast){
      let [newRow,newCol] = getNext(row,col);
      return solver(grid,newRow,newCol);
    }
  }
   for(let num=1;num<=9;num++){
    //check if this num is satisfying sudoku constraints
    if(checkValid(grid,row,col,num)){
      //fill that num in that cell
      grid[row][col]=num;
      // get next cell in repeat the same function
      let [newRow, newCol] = getNext(row,col);

      if(!newRow && !newCol){
        return true;
      }

      if(solver(grid,newRow,newCol)){
        return true;
      }
    }
   }

   //if its invalid fill with -1
   grid[row][col]=-1;
   return false;
 }

//this function is to solve sudoku 
 function solveSudoku(){
  let sudoku = getDeepCopy(init);
  solver(sudoku,0,0);
  setSudokuArr(sudoku);
}


//this function is to reset sudoku
function resetSudoku(){
  let sudoku = getDeepCopy(init);
  setSudokuArr(sudoku);
}



  return (
    <div className="App">
      <div className="App-Header">
      <h3>MY SUDOKU</h3>
      <table className="tbl">
      <tbody>
      {
        [0,1,2,3,4,5,6,7,8].map((row,rIndex) => {
           return <tr key={rIndex} className={(row+1)%3===0 ? 'bBorder' : ''} >
           {[0,1,2,3,4,5,6,7,8].map((col,cIndex)=>{
            return <td key={rIndex+cIndex}  className={(col)%3===0 ? 'rBorder' : ''}>     
            <input onChange={(e) => onInputChange(e,row,col)} 
            value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]} 
            className="cellInput"
            disabled={init[row][col] !== -1}/>
            </td>
           })}
           </tr>
        })
      }
      </tbody>
      </table>
      <div className="buttonContainer">
      <button className="checkBtn" onClick={checkSudoku} >check</button>
      <button className="solveBtn" onClick={solveSudoku} >solve</button>
      <button className="resetBtn" onClick={resetSudoku} >reset</button>
      </div>
      </div>
    </div>
  );
}

export default App;

/*
6
4 3 6 6 2 9
6 4 2 3 6 9
2 3 4 6 6 9


1 0 0
0 1 0
0 0 1


1 0 0 1
0 1 1 0
0 1 1 1
1 0 1 1
*/