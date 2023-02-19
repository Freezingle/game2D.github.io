const canvas= document.querySelector("canvas");
const ctx= canvas.getContext("2d");

canvas.width=1024;
canvas.height=576;

ctx.fillRect(0,0,canvas.width,canvas.height);
const gravity= 0.4;
const myAudio= new Audio();

class Sprite{
    constructor({position,velocity,offset},color)
    {
        this.position=position;
        this.velocity=velocity;
        this.width= 50;
        this.height=150;
        this.color=color;
        this.lastkey;
        this.isAttacking;
        this.hitPoints= 100;
        this.attackBox={
            position: {
                x: this.position.x,
                y:this.position.y
            },
            width:100,
            height:50,
            offset //this means offset: offset;
            }
    }
    draw()
    {
        //drawing player
      ctx.fillStyle=this.color;
      ctx.fillRect(this.position.x, this.position.y, this.width ,this.height);

       //drawing atk box layout
       if(this.isAttacking){   
    ctx.fillStyle= "green";
    ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
    }
   
    update()
    {
        
        this.draw();

      //drawing atk box literally!
        this.attackBox.position.x=this.position.x+this.attackBox.offset.x;  
        this.attackBox.position.y= this.position.y;
        //gravity effect
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;
        
        if(this.position.y+this.height+ this.velocity.y>=canvas.height)
        {
            this.velocity.y=0
        }
        else{
            this.velocity.y+=gravity;
        }
    }
    attack()
    {
        this.isAttacking= true;
       setTimeout(()=>{
            this.isAttacking= false;
       },100)    
    }
    
}


const player1= new Sprite({
    
   position: {
     x:0,
    y:0
},
   velocity: {
    x:0,
    y:0
},
   offset:{
    x:0,
    y:0
   }
},

"red");

const player2= new Sprite({
   position:{ x:400,
    y:50
},
   velocity: {
    x:0,
    y:0
},
   offset:{
    x:0,
    y:0
   }},"blue");

const keys={
    a:{
        pressed: false
    },
    d:{
      pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowRight:{
        pressed:false
    }
}
function rectangularCollision({rectangle1,rectangle2})
{
    return(rectangle1.attackBox.position.x+rectangle1.attackBox.width>= rectangle2.position.x &&
        rectangle1.attackBox.position.x<=rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y+rectangle1.attackBox.height>=rectangle2.position.y &&
        rectangle1.attackBox.position.y<= rectangle2.position.y+rectangle2.height)
}
let gameOver= document.querySelector("#gameOver");
let display= document.querySelector("#display");
function checkWin({player1,player2})
{
   gameOver.style.display="flex";
   display.innerHTML= "Vaisakyo!"
   if(player1.hitPoints<=0)
   {
    result.innerHTML="PLAYER2 WINS !!";
   }
   else if(player2.hitPoints<=0)
   {
    result.innerHTML="PLAYER1 WINS!!";
   }
   else if(player1.hitPoints<=0 && player1.hitPoints<=0)
   {
    result.innerHTML="DRAW!!";
   }
  

   document.querySelector("#restartbtn").onclick= function(){

    location.reload();
   }
}

function animate()
{
    window.requestAnimationFrame(animate);
    ctx.fillStyle= "skyblue";
    ctx.fillRect(0,0, canvas.width,canvas.height);
    player1.update();
    player2.update();
    player1.velocity.x=0;
    player2.velocity.x=0;
    player1.attackBox.offset.x=0;
    player2.attackBox.offset.x=0;
     //PLAYER1 MOVEMENT
    if(keys.a.pressed && player1.lastkey=='a')
    { player1.velocity.x=-5;}

    else if(keys.d.pressed && player1.lastkey=='d')
    {player1.velocity.x=5;}

    //PLAYER2 MOVEMENT
    if(keys.ArrowLeft.pressed && player2.lastkey=='ArrowLeft')
    {player2.velocity.x=-5;}
    else if(keys.ArrowRight.pressed && player2.lastkey=='ArrowRight')
    {player2.velocity.x=5;}

    //offset placing of attackBox
    if(player1.position.x+player1.width>=player2.position.x)
    {
       player1.attackBox.offset.x=-50;
        
    }
    else if(player2.position.x>=player1.position.x+player1.width)
    {
        player2.attackBox.offset.x=-50;
    }

    //Collision Detection
    //player1
    if( rectangularCollision({rectangle1:player1,
         rectangle2:player2})
         && player1.isAttacking)
    {
        player1.isAttacking=false;
        console.log("player1 attacked");
        player2.hitPoints-=10;
        document.querySelector("#player2H").style.width= player2.hitPoints+"%";
        myAudio.src="mixkit-man-in-pain-2197.wav";
        myAudio.play();
    

    }

    //player2
    if( rectangularCollision({rectangle1:player2,
        rectangle2:player1})
        && player2.isAttacking)
   {
       player2.isAttacking=false;
       console.log("player2 attacked");
       player1.hitPoints-=10;
       document.querySelector("#player1H").style.width= player1.hitPoints+"%";
       myAudio.src="mixkit-ow-exclamation-of-pain-2204.wav";
       myAudio.play();
   }
   if(player1.hitPoints<=0 || player2.hitPoints<=0)
   {
       checkWin({player1,player2});
   }

}
window.addEventListener("load",animate());

window.addEventListener("keydown", (event)=>
{
 switch(event.key)
 {
    case "d":
       keys.d.pressed=true;
       player1.lastkey='d';
        break;
    case "a":
       keys.a.pressed= true;
       player1.lastkey='a';
       break;
    case "w":
        
        if(player1.position.y+150>=576)
        {player1.velocity.y=-15;}
        break;
    case " ":
        player1.attack();
        break;
    case "ArrowLeft":
            keys.ArrowLeft.pressed=true;
            player2.lastkey='ArrowLeft';
            break;
    case "ArrowRight":
        keys.ArrowRight.pressed=true;
        player2.lastkey="ArrowRight";
        break;
    case "ArrowUp":
        if(player2.position.y+150>=576)
        {player2.velocity.y=-15;}
        break;
    case "ArrowDown":
        player2.attack();
        break;
 }
 

 
})

window.addEventListener("keyup", (event)=>
{
 switch(event.key)
 {
    case "d":
        keys.d.pressed=false;
        break;
    case "a":
        keys.a.pressed=false;
        break;
    case "ArrowLeft":
        keys.ArrowLeft.pressed=false;
        break;
    case "ArrowRight":
        keys.ArrowRight.pressed=false;
        break;
    }
})

//adding audios
