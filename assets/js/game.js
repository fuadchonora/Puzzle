let gameContainer = $('#gameContainer');
let containerTitle = $('#containerTitle');
let restartGameBtn = $('#restartGame')

let size = 5;
let matrix = [];
let tileNo = 1;
var uiEnabled = false;

let freeTilePos = { x: 0, y: 0}
var posSet = []

initPosSet = () => {
    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){
            let set = {
                x:i*100,
                y:j*100,
            }
            posSet.push(set);
        }
    }
}

initMatrix = () => {
    for(let idR=0; idR<size; idR++){
        matrix[idR] = [];
        for(let idC=0; idC<size; idC++){
            if((idR == (size-1)) && (idC == (size-1))){
                matrix[idR][idC] = null;
                return;
            }
            //console.log(idR+' '+idC+' :'+sliderNumber);
            matrix[idR][idC] = tileNo;
            tileNo++;
        }
    }
}

initUI = () => {
    tileNo = 1;
    for(let idR in matrix){
        let row = matrix[idR];
        for(let idC in row){
            if(matrix[idR][idC] == null){
                freeTilePos.x = idC * 100;
                freeTilePos.y = idR * 100;
            }else {
                var tile = {
                    id: "tile-"+tileNo,
                    class: "tile flex-center flex-column",
                };
                var $div = $("<div>", tile);
                $div.html(tileNo);
                gameContainer.append($div);
                let x = idC * 100;
                let y = idR * 100;
                document.getElementById("tile-"+tileNo).style.transform = "translate("+x+"px, "+y+"px)";
                tileNo++;
            }
        }
    }
}

shufleTiles = () => {
    disableUI();
    var posSetTemp = posSet.slice();
    $('.tile').each(function(){
        let tile = $(this);
        tileNo = tile.html();

        let idX = Math.floor(Math.random() * posSetTemp.length);
        let x = posSetTemp[idX]['x'];
        let y = posSetTemp[idX]['y'];
        posSetTemp.splice(idX, 1);

        document.getElementById("tile-"+tileNo).style.transform = "translate("+x+"px, "+y+"px)";
    });

    freeTilePos.x = posSetTemp[0]['x'];
    freeTilePos.y = posSetTemp[0]['y'];

    containerTitle.html('Slide It & Win');
    enableUI();
    console.log(posSet);
    console.log(posSetTemp)
}

moveTile = (tile) => {
    tileNo = tile.html();
    let tempPos = tile.position();
    if( (tempPos.left+tempPos.top == freeTilePos.x+freeTilePos.y-100) || (tempPos.left+tempPos.top == freeTilePos.x+freeTilePos.y+100) ){
        disableUI();
        console.log('moving tile '+tileNo);
        document.getElementById("tile-"+tileNo).style.transform = "translate("+freeTilePos.x+"px, "+freeTilePos.y+"px)";
        freeTilePos.x = tempPos.left;
        freeTilePos.y = tempPos.top;
    }
    setTimeout(function(){
        checkStatus();
    },500);
}

enableUI = () => {
    console.log('enabling ui')
    uiEnabled = true;
}
disableUI = () => {
    console.log('disabling ui')
    uiEnabled = false;
}

checkStatus = () => {
    let preVal = 0;
    let status = false;
    $('.tile').each(function(){
        let tile = $(this)
        console.log(parseInt(tile.html())-1);
        let pos = tile.position();
        let val = (pos.top*5/100)+(pos.left/100);
        val = Math.round(val);
        console.log('val:'+val);
        if( parseInt(tile.html()) !== (val+1) ){
            console.log('LOOOSSEEE...');
            status = false;
            return false;
        }
        status = true;
    })
    if(status == true){
        console.log('WOOOOOOOOOONNNN....');
        containerTitle.html('You Won It.');
        disableUI();
    }else{
        enableUI();
    }
}

$('#gameContainer').on('click','.tile',function(event){
    console.log('tile clicked');
    if(uiEnabled == true){
        moveTile($(this));
    }
})

restartGameBtn.on('click', function(event){
    disableUI();
    containerTitle.html('Slide It & Win');
    shufleTiles();
})

$(document).ready(function(){
    disableUI();
    initMatrix();
    initPosSet();
    initUI();
    shufleTiles();
})