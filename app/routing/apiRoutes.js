//a POST routes /api/friends - this handles incoming survey results. will also used to handle the compatibility logic
//Load Data
var friendList = require("../data/friends");

// module.exports = function (app) {
//     //a GET route that displays JSON of all possible friends
//     app.get('/api/friends', function (req, res) {
//         res.json(friendList);
//     });

//     app.post('/api/friends', function (req, res) {
//         //grabs the new friend's scores to compare with friends in friendList array
//         var newFriendScores = req.body.scores;
//         var scoresArray = [];
//         var friendCount = 0;
//         var bestMatch = 0;

//         //runs through all current friends in list
//         for (var i = 0; i < friendList.length; i++) {
//             var scoresDiff = 0;
//             //run through scores to compare friends
//             for (var j = 0; j < newFriendScores.length; j++) {
//                 scoresDiff += (Math.abs(parseInt(friendList[i].scores[j]) - parseInt(newFriendScores[j])));
//             }

//             //push results into scoresArray
//             scoresArray.push(scoresDiff);
//         }

//         //after all friends are compared, find best match
//         for (var i = 0; i < scoresArray.length; i++) {
//             if (scoresArray[i] <= scoresArray[bestMatch]) {
//                 bestMatch = i;
//             }
//         }

//         //return bestMatch data
//         var bff = friendList[bestMatch];
//         res.json(bff);

//         //pushes new submission into the friendsList array
//         friendList.push(req.body);
//     });
// };

module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
    // ---------------------------------------------------------------------------

    app.get("/api/friends", function (req, res) {
        res.json(friendList);
    });

    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // ---------------------------------------------------------------------------

    app.post("/api/friends", function (req, res) {
        // Note the code here. Our "server" will respond to a user"s survey result
        // Then compare those results against every user in the database.
        // It will then calculate the difference between each of the numbers and the user"s numbers.
        // It will then choose the user with the least differences as the "best friend match."
        // In the case of multiple users with the same result it will choose the first match.
        // After the test, it will push the user to the database.

        // We will use this object to hold the "best match". We will constantly update it as we
        // loop through all of the options
        var bestMatch = {
            name: "",
            photo: "",
            friendDifference: Infinity
        };

        // Here we take the result of the user"s survey POST and parse it.
        var userData = req.body;
        var userScores = userData.scores;

        // This variable will calculate the difference between the user"s scores and the scores of
        // each user in the database
        var totalDifference;

        // Here we loop through all the friend possibilities in the database.
        for (var i = 0; i < friendList.length; i++) {
            var currentFriend = friendList[i];
            totalDifference = 0;

            console.log(currentFriend.name);

            // We then loop through all the scores of each friend
            for (var j = 0; j < currentFriend.scores.length; j++) {
                var currentFriendScore = currentFriend.scores[j];
                var currentUserScore = userScores[j];

                // We calculate the difference between the scores and sum them into the totalDifference
                totalDifference += Math.abs(parseInt(currentUserScore) - parseInt(currentFriendScore));
            }

            // If the sum of differences is less then the differences of the current "best match"
            if (totalDifference <= bestMatch.friendDifference) {
                // Reset the bestMatch to be the new friend.
                bestMatch.name = currentFriend.name;
                bestMatch.photo = currentFriend.photo;
                bestMatch.friendDifference = totalDifference;
            }
        }

        // Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
        // the database will always return that the user is the user's best friend).
        friendList.push(userData);

        // Return a JSON with the user's bestMatch. This will be used by the HTML in the next page
        res.json(bestMatch);
    });
};