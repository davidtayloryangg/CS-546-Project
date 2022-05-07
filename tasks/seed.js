// init database
const users = require("../data/users");
const parks = require("../data/parks");
const activities = require("../data/activities");
const appointments = require("../data/appointments");
const comments = require("../data/comments");
const reviews = require("../data/reviews");

const dbConnection = require("../config/mongoConnection");
const { getPark, getParkByName } = require("../data/parks");

async function test() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  console.log("------------Init Users------------");
  const user1 = await users.createUser(
    "Yuheng",
    "Xiao",
    "yxiao38@stevens.edu",
    "Xyh123456"
  );
  const user2 = await users.createUser(
    "Yue",
    "Qin",
    "qinyue12345@gmail.com",
    "qinyue12345"
  );
  const user3 = await users.createUser(
    "David",
    "Yang",
    "davidtayloryang@gmail.com",
    "davidyang12345"
  );
  const user4 = await users.createUser(
    "Yutong",
    "Wei",
    "weiyutong123@stevens.edu",
    "12345678"
  );
  await users.updateUserPermission(user1._id);
  await users.updateUserPermission(user2._id);
  await users.updateUserPermission(user3._id);
  await users.updateUserPermission(user4._id);
  console.log("------------create users successfully------------");

  console.log("------------Init Parks------------");
  const columbus = await parks.createPark(
    "Columbus Park",
    "06:00",
    "22:00",
    "900 Clinton St, Hoboken, NJ 07030"
  ); //Activities: Tennis
  console.log(columbus._id + " : " + columbus._id);
  const churchSquare = await parks.createPark(
    "Church Square Park",
    "06:00",
    "23:00",
    "400 Garden St, Hoboken, NJ 07030"
  ); //Activities: Basketball
  const madison = await parks.createPark(
    "Madison Park",
    "06:00",
    "22:00",
    "305 Monroe St, Hoboken, NJ 07030"
  ); //Activities: Jog
  const sinatra = await parks.createPark(
    "Sinatra Park",
    "00:01",
    "00:00",
    "500 Frank Sinatra Dr, Hoboken, NJ 07030"
  ); //Activities: Soccer
  const stevens = await parks.createPark(
    "Stevens Park",
    "08:00",
    "22:00",
    "401 Hudson St, Hoboken, NJ 07030"
  ); //Activities: Baseball
  const CP = await parks.createPark(
    "Castle Point Skatepark",
    "00:01",
    "00:00",
    "9 Castle Point Terrace, Hoboken, NJ 07030"
  ); //Activities: Skate
  const PC = await parks.createPark(
    "Pier C Park",
    "08:00",
    "22:00",
    "340 Sinatra Dr, Hoboken, NJ 07030"
  ); //Activities: Yoga
  const PA = await parks.createPark(
    "1600 Park",
    "07:00",
    "22:00",
    "340 Sinatra Dr, Hoboken, NJ 07030"
  ); //Activities: Rugby
  await parks.updateParkImg(columbus._id, "/public/img/columbus.jpg");
  await parks.updateParkImg(churchSquare._id, "/public/img/church.jpg");
  await parks.updateParkImg(madison._id, "/public/img/madison.jpg");
  await parks.updateParkImg(sinatra._id, "/public/img/sinatra.jpg");
  await parks.updateParkImg(stevens._id, "/public/img/stevens.jpg");
  await parks.updateParkImg(CP._id, "/public/img/castlePoint.jpg");
  await parks.updateParkImg(PC._id, "/public/img/pierC.jpg");
  await parks.updateParkImg(PA._id, "/public/img/1600park.jpg");
  await parks.updateParkLikes(columbus._id, 55);
  await parks.updateParkLikes(churchSquare._id, 90);
  await parks.updateParkLikes(madison._id, 80);
  await parks.updateParkLikes(sinatra._id, 90);
  await parks.updateParkLikes(stevens._id, 100);
  await parks.updateParkLikes(CP._id, 60);
  await parks.updateParkLikes(PC._id, 65);
  await parks.updateParkLikes(PA._id, 70);
  console.log("------------create parks successfully------------");

  console.log("------------Init Activities------------");
  // create a new activities:

  const TennisColumbus = await activities.createActivity(
    columbus._id.toString(),
    "Tennis",
    "3",
    "6",
    "2"
  );
  const BasketballChurchSquare = await activities.createActivity(
    churchSquare._id.toString(),
    "Basketball",
    "3",
    "30",
    "10"
  );
  const JogMadison = await activities.createActivity(
    madison._id.toString(),
    "Jog",
    "1",
    "20",
    "1"
  );
  const SoccorSinatra = await activities.createActivity(
    sinatra._id.toString(),
    "Soccer",
    "1",
    "22",
    "22"
  );
  const BaseballStevens = await activities.createActivity(
    stevens._id.toString(),
    "Baseball",
    "1",
    "18",
    "18"
  );
  const SkateCP = await activities.createActivity(
    CP._id.toString(),
    "Skate",
    "1",
    "15",
    "1"
  );
  const YogaPC = await activities.createActivity(
    PC._id.toString(),
    "Yoga",
    "2",
    "4",
    "1"
  );
  const RugbyPA = await activities.createActivity(
    PA._id.toString(),
    "Rugby",
    "1",
    "30",
    "30"
  );
  //CHURCH SQUARE PARK
  const dogParkChurch = await activities.createActivity(
    churchSquare._id.toString(),
    "Dog Park Church Square Park",
    "1",
    "20",
    "1"
  );
  const BasketballChurch = await activities.createActivity(
    churchSquare._id.toString(),
    "Basketball Church Square Park",
    "1",
    "20",
    "1"
  );
  //MADISON PARK
  const playgroundMadison = await activities.createActivity(
    madison._id.toString(),
    "Playground Madison Park",
    "1",
    "20",
    "1"
  );
  //SINATRA PARK
  const soccerSinatra = await activities.createActivity(
    sinatra._id.toString(),
    "Soccer Sinatra Park",
    "1",
    "22",
    "1"
  );
  //STEVENS PARK
  const baseballStevens = await activities.createActivity(
    stevens._id.toString(),
    "Baseball Stevens Park",
    "1",
    "20",
    "1"
  );
  //CASTLE POINT SKATEPARK
  const skateCastlePoint = await activities.createActivity(
    CP._id.toString(),
    "Skate Castle Point Skatepark",
    "1",
    "20",
    "1"
  );
  //PIER C PARK
  const playgroundPierC = await activities.createActivity(
    PC._id.toString(),
    "Playground Pier C Park",
    "1",
    "20",
    "1"
  );
  //1600 PARK
  const soccer1600 = await activities.createActivity(
    PA._id.toString(),
    "Soccer 1600 Park",
    "1",
    "22",
    "1"
  );
  await activities.updateActivityDescription(TennisColumbus._id, 
    `Tennis is a racket sport that can be played individually against a single opponent
  (singles)
  or between two teams of two players each (doubles). Each player uses a tennis racket that is
  strung with
  cord to strike a hollow rubber ball covered with felt over or around a net and into the
  opponent's
  court. The object of the game is to manoeuvre the ball in such a way that the opponent is not
  able to
  play a valid return. The player who is unable to return the ball validly will not gain a point,
  while
  the opposite player will.`
  
  )
  await activities.updateActivityDescription(BasketballChurchSquare._id, 
    `Basketball is a team sport in which two teams, most commonly of five players each,
    opposing
    one another on a rectangular court, compete with the primary objective of shooting a basketball
    (approximately 9.4 inches (24 cm) in diameter) through the defender's hoop (a basket 18 inches
    (46 cm)
    in diameter mounted 10 feet (3.048 m) high to a backboard at each end of the court, while
    preventing the
    opposing team from shooting through their own hoop. A field goal is worth two points, unless
    made from
    behind the three-point line, when it is worth three. After a foul, timed play stops and the
    player
    fouled or designated to shoot a technical foul is given one, two or three one-point free throws.
    The
    team with the most points at the end of the game wins, but if regulation play expires with the
    score
    tied, an additional period of play (overtime) is mandated.`
  
  )
  await activities.updateActivityDescription(JogMadison._id, 
    `Jogging is a form of trotting or running at a slow or leisurely pace. The main
    intention is
    to increase physical fitness with less stress on the body than from faster running but more than
    walking, or to maintain a steady speed for longer periods of time. Performed over long
    distances, it is a form of
    aerobic endurance training.`
  
  )
  await activities.updateActivityDescription(SoccorSinatra._id, 
    `Association football, more commonly known as simply football or soccer,[a] is a team
    sport
    played with a spherical ball between two teams of 11 players. It is played by approximately 250
    million
    players in over 200 countries and dependencies, making it the world's most popular sport. The
    game is
    played on a rectangular field called a pitch with a goal at each end. The objective of the game
    is to
    score more goals than the opposition by moving the ball beyond the goal line into the opposing
    goal, usually
    within a time frame of 90 or more minutes.`
  
  )
  await activities.updateActivityDescription(BaseballStevens._id, 
    `Baseball is a bat-and-ball game played between two opposing teams, of nine players
    each,
    that take turns batting and fielding. The game proceeds when a player on the fielding team,
    called the
    pitcher, throws a ball which a player on the batting team tries to hit with a bat. The objective
    of the
    offensive team (batting team) is to hit the ball into the field of play, allowing its players to
    run the bases,
    having them advance counter-clockwise around four bases to score what are called "runs". The
    objective
    of the defensive team (fielding team) is to prevent batters from becoming runners, and to
    prevent runners'
    advance around the bases.[2] A run is scored when a runner legally advances around the bases in
    order
    and touches home plate (the place where the player started as a batter). The team that scores
    the most runs
    by the end of the game is the winner.`
  
  )
  await activities.updateActivityDescription(SkateCP._id, 
    `Skating involves any sports or recreational activity which consists of traveling on
    surfaces
    or on ice using skates.`
  
  )

  await activities.updateActivityDescription(YogaPC._id, 
    `Yoga as exercise is a physical activity consisting mainly of postures, often
    connected by
    flowing sequences, sometimes accompanied by breathing exercises, and frequently ending with
    relaxation
    lying down or meditation. Yoga in this form has become familiar across the world, especially in
    America and
    Europe. It is derived from medieval Haṭha yoga, which made use of similar postures, but it is
    generally
    simply called "yoga". Academics have given yoga as exercise a variety of names, including modern
    postural yoga and transnational anglophone yoga.`
  
  )
  await activities.updateActivityDescription(RugbyPA._id, 
    `Rugby football is a collective name for the family of team sports of rugby union and
    rugby
    league, as well as the earlier forms of football from which both games, as well as Australian
    rules
    football and gridiron football, evolved.`
  )
  
  console.log("------------create activities successfully------------");

  console.log("------------Init Appointments------------");
  const appointment1 = await appointments.createAppointment(
    user1._id.toString(),
    churchSquare._id.toString(),
    BasketballChurchSquare._id.toString(),
    "2022",
    "6",
    "16",
    "12"
  );
  console.log("------------create appointments successfully------------");

  console.log("------------Init Comments------------");
  const comment1 = await comments.createComment(
    churchSquare._id,
    user3._id,
    3.5,
    "I love it!"
  );
  const comment2 = await comments.createComment(
    columbus._id,
    user3._id,
    4.6,
    "amazing!"
  );
  const comment3 = await comments.createComment(
    madison._id,
    user3._id,
    3.9,
    "free to play"
  );
  const comment4 = await comments.createComment(
    sinatra._id,
    user3._id,
    4.55,
    "nice view!"
  );
  const comment5 = await comments.createComment(
    stevens._id,
    user3._id,
    4.8,
    "amazing!"
  );
  const comment6 = await comments.createComment(
    CP._id,
    user3._id,
    4.75,
    "god!"
  );
  const comment7 = await comments.createComment(
    PC._id,
    user3._id,
    4.91,
    "nice park!"
  );
  const comment8 = await comments.createComment(
    PA._id,
    user3._id,
    4.2,
    "amazing!"
  );
  await comments.replyComment(comment1._id, user4._id, "say it again????");
  await comments.replyComment(comment2._id, user4._id, "say it again????");
  await comments.replyComment(comment3._id, user4._id, "say it again????");
  await comments.replyComment(comment4._id, user4._id, "say it again????");
  await comments.replyComment(comment5._id, user4._id, "say it again????");
  await comments.replyComment(comment6._id, user4._id, "say it again????");
  await comments.replyComment(comment7._id, user4._id, "say it again????");
  await comments.replyComment(comment8._id, user4._id, "say it again????");
  console.log("------------create comments successfully------------");

  console.log("------------Init Reviews------------");
  // const review1 = await reviews.createReview(
  //   user1._id,
  //   BasketballColumbus._id,
  //   "nice!!!!!"
  // );
  console.log("------------create reviews successfully------------");

  console.log("------------add favorite park---------------------");
  await users.addfavorite(user1._id, columbus._id);
  await users.addfavorite(user2._id, columbus._id);
  await users.addfavorite(user3._id, columbus._id);
  await users.addfavorite(user4._id, columbus._id);

  console.log("------------test------------");

  await dbConnection.closeConnection();
}

test();
