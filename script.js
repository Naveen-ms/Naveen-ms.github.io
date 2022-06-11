var rows = 20;
var columns = 20;
var total_mines = 10;
var board= [];
var bomb_location = generate_mines();
var tilesClicked = 0;
var total_tiles = 0;
var finish = false;
var total_flags = 0;
var timer;
var flagged_list = []

function startTimer(){
    if(finish==false){
    var min = document.getElementById("minutes");
    var sec = document.getElementById("seconds");
    timeseconds=0;
    timer = setInterval(function(){
        ++timeseconds;
        if(timeseconds%60<10){sec.innerText=String(0)+String(timeseconds%60);}
        else{sec.innerText=String(timeseconds%60);}
        if(parseInt(timeseconds/60)<10){min.innerText = String(0)+String(parseInt(timeseconds/60));}
        else{min.innerText =String(parseInt(timeseconds/60));}
    },1000)
    }
    else{
        clearInterval(timer);
        document.getElementById("time").classList.add('blink');
    }
    

}

function generate_mines(){
    L = []
    let count = 0;
    while(count<total_mines){
     let r = Math.floor(Math.random() * rows);
     let c = Math.floor(Math.random() * columns);
     let id = r.toString() + "-" + c.toString();
     
     if(!L.includes(id)){
     L.push(id);
     count++;
    }
}
    return L;
}

console.log(bomb_location);

function startGame(){
    const b = document.getElementById('box')
    for(let i=0;i<rows;i++){
        let keys = []
        for(let j=0;j<columns;j++){
            const tiles = document.createElement('div');
            tiles.id = String(i)+"-"+String(j)
            b.append(tiles);
            tiles.addEventListener("click",Tile_clicked);
            keys.push(tiles);
        }
        board.push(keys);
    }
    document.getElementById('Emoji').addEventListener("click",()=>location.reload());   
    
}



function Tile_clicked(){
    if(finish==true){
        return;
    }
    tilesClicked++;
    console.log(tilesClicked);
    if(tilesClicked==1){
        startTimer();
    }
    if(this.classList.contains('flagged')){return;}
    if(this.classList.contains('tile-clicked')){
        return;
    }
    if(bomb_location.includes(this.id)){
        show_all_mines();
        document.getElementById('Emoji').style.backgroundImage='url("sad.jpg")';
        document.getElementById('Message').innerText="You Lose !!";

    }
    else{
        let p = this.id.split("-");
        let r = parseInt(p[0]);
        let c = parseInt(p[1]);  
        nearest_count(r,c);
    }
}

function nearest_count(row,col){
    total_count = 0;
    if(row<0 || col>columns-1 || row>rows-1 || columns<0){
        return;
    }
    if(board[row][col]==undefined){
        return;
    }
    if(bomb_location.includes(row.toString() + "-" + col.toString())){
        return;
    }
    if(board[row][col].classList.contains('flagged')){return;}    
    if(board[row][col].classList.contains('tile-clicked')){
        return;
    }
    total_count+=check_bomb_here(row-1,col-1)
    total_count+=check_bomb_here(row-1,col)
    total_count+=check_bomb_here(row-1,col+1)
    total_count+=check_bomb_here(row,col-1)
    total_count+=check_bomb_here(row,col+1)
    total_count+=check_bomb_here(row+1,col)
    total_count+=check_bomb_here(row+1,col-1)
    total_count+=check_bomb_here(row+1,col+1)
    board[row][col].classList.add("tile-clicked");
    total_tiles++;
    if(total_tiles==(rows*columns-total_mines)){
        document.getElementById('Message').innerText="You Win!!";
        finish=true;
        startTimer();
    }
    if(total_count!=0){
        board[row][col].innerText=total_count;
        board[row][col].classList.add('x'+String(total_count));
    }
    if(total_count==0){
        nearest_count(row+1,col)
        nearest_count(row,col+1)
        nearest_count(row-1,col-1)
        nearest_count(row,col-1)
        nearest_count(row-1,col+1)
        nearest_count(row+1,col-1)
        nearest_count(row-1,col)
        nearest_count(row+1,col+1)
    }        
}

function check_bomb_here(r,c){
    if(r<0 || c>columns || r>rows || c<0){
        return 0;
    }
    else if(bomb_location.includes(String(r)+"-"+String(c))){
        return 1;
    }
    else{
        return 0;
    }
}

function show_all_mines(){
    var w = window.matchMedia("(max-width: 426px)")
    for(let i=0;i<bomb_location.length;i++){
        if(w.matches){document.getElementById(bomb_location[i]).style.backgroundSize='14px 14px';}
        else{document.getElementById(bomb_location[i]).style.backgroundSize='24px 24px';}
        
        if(flagged_list.includes(bomb_location[i])){
            document.getElementById(bomb_location[i]).style.backgroundImage='url("bomb_cancel.jpg")';

        }
        else{document.getElementById(bomb_location[i]).style.backgroundImage='url("bomb.png")';}
    }
    finish=true;
    startTimer();
}
startGame();
var div = $( "#box div" );
div.contextmenu(function(clickEvent) {
  clickEvent.preventDefault();
  p = String(this.id);
  var par = document.getElementById(p);
  if(par.classList.contains('tile-clicked')){return;}
  if(flagged_list.length<39){
    if(par.classList.contains('tile-clicked')){return;}
    else{    
        if(flagged_list.includes(p)){
         console.log(true);
        let index =   flagged_list.indexOf(p);
        flagged_list.splice(index,1);
    }
        else{flagged_list.push(p);}
        par.classList.toggle("flagged");
        }
        document.getElementById("num").innerText=total_mines-flagged_list.length;
    }
    
    else{return;}
});
