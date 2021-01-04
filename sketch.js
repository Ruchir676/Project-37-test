var dog, dogImage, happyDog, bedroom, washroom, gardem, database, foodS, foodStock;

var addButton, feedButton;
var fedTime, lastFed;
var foodObj;

var readState, gameState;

function preload()
{
  sadDog = loadImage("virtual pet images/Dog.png");
  happyDog = loadImage("virtual pet images/Happy.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
  garden = loadImage("virtual pet images/Garden.png");

}

function setup() {
	createCanvas(900, 500);
  
  dog = createSprite(800,200);
  dog.addImage(sadDog);
  dog.scale=0.15;

  database = firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value", function(data) {
    gameState = data.val();
  })

  foodObj = new Food();

  feedButton = createButton("Feed the dog");
  feedButton.position(700,95);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Add Food");
  addButton.position(800,95);
  addButton.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);

  drawSprites();

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(gameState!=="Hungry") {
    feedButton.hide();
    addButton.hide();
    dog.remove();
  } else {
    feedButton.show();
    addButton.show();
    dog.addImage(sadDog);
  }

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12) {
    text("Last Feed : "+lastFed%12+ " PM",350,30);
  } else if(lastFed === 0) {
    text("Last Feed : 12 AM",350,30);
  } else {
    text("Last Feed : "+lastFed + " AM",350,30);
  }


  currentTime=hour();
  if(currentTime===(lastFed+1)) {
    update("Playing");
    foodObj.garden();
  } else if(currentTime===(lastFed+2)) {
    update("Sleeping");
    foodObj.bedroom();
  } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)) {
    update("Bathing");
    foodObj.washroom();
  } else{
    update("Hungry");
    foodObj.display();
  }



}


function readStock(data) {
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour() 
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState:state
  });
}

