var dog, dogImg, dogImg2;
var feed;
var food = 0;
var lastFeed = 0;
var gameState = 0;
var currentTime;
var bedroomImg, gardenImg, WashroomImg;

function preload(){
	 dogImg = loadImage("Dog.png");
   dogImg2 = loadImage("Happy.png");
   bedroom = loadImage("Bed Room.png")
   garden = loadImage("Garden.png")
   Washroom = loadImage("Wash Room.png")
   Lazy = loadImage("Lazy.png");
}

function setup() {
  database = firebase.database();
  console.log(database);

	createCanvas(500,500);
  dog = createSprite(250,250,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.1;

  var foodStock = database.ref("food");
  foodStock.on("value",function(data){
    food = data.val();
  });

  var feedTime = database.ref("feedTime/lastFeed");
  feedTime.on("value",function(data){
    lastFeed = data.val();
  });

  var readState = database.ref("gameState");
  readState.on("value",function(data){
    gameState = data.val();
  });

//  feed = new Feed();
  dogFood = new Food();
}

function draw() {  
  background(46,139,87);
  fill('skyblue');

  if (lastFeed>=12){
    text("Last Feed: "+lastFeed%12+"PM",350,30);
  }
  else if (lastFeed == 0){
    text("Last Feed: 12AM",350,30);
  }
  else{
    text("Last Feed: "+lastFeed+"AM",350,30);
  }

 // feed.display();

  if (gameState != 0){
    feed.visible = false;
    dog.visible = false;
  }
  else{
    Button();
    dog.visible = true;
    dogFood.display();
  }

  currentTime = hour()%12;
  console.log("ct"+currentTime);
  console.log("lF"+lastFeed);
  if (currentTime == (lastFeed+1)){
    update(1);
    feed.hide();
    dogFood.garden();
  }
  else if (currentTime == (lastFeed+2)){
    update(2);
    dogFood.bedroom();
  }
  else if (currentTime>(lastFeed+2) && currentTime<=(lastFeed+4)){
    update(3);
    dogFood.washroom();
  }
  else{
    update(0);
  
  }
 
  drawSprites();
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
 }

 function Button(){
 feed = createButton("Feed The Dog");
  feed.position(400,50);
  feed.mousePressed(function(){ console.log("hello");
  dog.addImage(dogImg2);
  food-=1;
  lastFeed++;
  database.ref('/').update({
  "food":food

 })});

 var addfood = createButton("Add Food");
  addfood.position(400,100);
  addfood.mousePressed(function(){
    database.ref('/').update({
      "food": food
      });
      food++;
  });
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
