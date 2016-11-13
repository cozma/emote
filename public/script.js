var API_KEY = "9992d8dcc5424933ab6f22d5d2fa0777";


$(function(){
    $(".camera-icon").on('click', function(){
        $("input.upload").trigger("click");
    });
});

function readImage(file) {
    // A file reader to preview the image on the screen
    var displayReader = new FileReader();
    displayReader.onload = function(e) {
        //displayImage(e.target.result);
    };
    //console.log(file);
    //displayReader.readAsDataURL(file);

    // A file reader to send image to Microsoft Cognitive Services
    var emotionReader = new FileReader();
    emotionReader.onload = function (e) {

        getEmotion (e.target.result, function(emotion){
            $("header2").text("You're showing a lot of " + emotion + " today!");
        });
    };
    emotionReader.readAsArrayBuffer(file);
}

function displayImage (image) {
    $('.pic').attr('src', image);
}

function getEmotion (image, callback) {

    $.ajax({
        url : 'https://api.projectoxford.ai/emotion/v1.0/recognize',
        type: 'POST',
        processData: false,
        contentType: "application/octet-stream",
        data: image,
        headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": API_KEY
        },
        success: function(data) {
            var emotion = getMostLikelyEmotion(data);
            //alert("Emotion Identified!")
            callback (emotion);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert ("Error...");
        }
    });
}

function getMostLikelyEmotion (data){
    var emotionScores = data[0].scores || {};

    var scores = Object
        .keys(emotionScores)
        .map(function(emotion){
            return emotionScores[emotion];
        });

    var highestScore = Math.max.apply(Math, scores);

    makeChart(emotionScores);
    makeSumChart();
    makeGroupChart();

    console.log(emotionScores);

    for (var emotion in emotionScores){
        if (emotionScores[emotion] === highestScore){
            return emotion;
        }
    }
}

function makeChart(emotionScores){
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        label: "Todays Emotions",
        type: 'polarArea',
        data: {
            labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness",
                "Neutral", "Sadness", "Surprise"],
            datasets: [{
                backgroundColor: [
                    "#2ecc71",
                    "#3498db",
                    "#95a5a6",
                    "#9b59b6",
                    "#f1c40f",
                    "#e74c3c",
                    "#34495e",
                    "#000BF0"
                ],
                data: [emotionScores["anger"], emotionScores["contempt"],
                    emotionScores["disgust"], emotionScores["fear"],
                    emotionScores["happiness"], emotionScores["neutral"],
                    emotionScores["sadness"], emotionScores["surprise"]]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        min: 0,
                        max: 0.1
                    }
                }]
            }
        }
    });

    //console.log(getEmotionScore(0));
}

function makeSumChart(){
    var ctx = document.getElementById("sumChart").getContext('2d');
    var sumChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness",
                "Neutral", "Sadness", "Surprise"],
            datasets: [{
                label: "1 Month of Emotions",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data:[0.05, 0.1,
                    0.02, 0.08,
                    0.6, 0.3,
                    0.09, 0.05]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        min: 0,
                        max: 1
                    }
                }]
            }
        }
    });

    //console.log(getEmotionScore(0));
}

function makeGroupChart(){
    showPool();
    var ctx = document.getElementById("groupChart").getContext('2d');
    var groupChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness",
                "Neutral", "Sadness", "Surprise"],
            datasets: [{
                label: "1 Month of Emotions",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data:[0.05, 0.1,
                    0.02, 0.08,
                    0.6, 0.3,
                    0.09, 0.05]
            }, {
                label: "General Average",
                backgroundColor: "rgba(99,200,30,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data:[0.1, 0.05,
                    0.04, 0.06,
                    0.4, 0.3,
                    0.09, 0.02]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        min: 0,
                        max: 1
                    }
                }]
            }
        }
    });

    //console.log(getEmotionScore(0));
}

function hideHint(){
    var hintText = document.getElementById("hint");
    hintText.innerHTML = "<br>";
    $(".hint").typed({
        strings: ["Here are all the emotions we found.  :)"],
        typeSpeed: 20,
        startDelay: 5,
        cursorChar: ""
    });

}

function showPool(){
    var hintText = document.getElementById("userPool");
    hintText.innerHTML = "<br>";
    $(".userPool").typed({
        strings: ["Check out how you stand against other users."],
        typeSpeed: 20,
        startDelay: 20,
        cursorChar: ""
    });

}


