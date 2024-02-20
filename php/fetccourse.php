<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alison Courses</title>
    <style>
        /* CSS styles for course div */
        .course-container {
            display: flex;
            flex-wrap: wrap;
        }
        .course {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px;
            width: calc(50% - 20px); /* 50% width with margins */
        }
        .course h2 {
            font-size: 18px;
            margin-bottom: 5px;
        }
        .course p {
            font-size: 14px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="course-container">
        <?php
        // Access token
        // $accessToken = 'your_access_token'; // Replace with your 
        //actual access token
        //.'?accessToken='

        // Fetch courses from Node.js server
        $url = 'localhost:3002/api/fetchCourses'; // Replace with your actual Node.js server URL
        $response = file_get_contents($url);
        $courses = json_decode($response, true);

        // Output courses
        foreach ($courses as $course) {
            ?>
            <div class="course">
                <h2><?php echo $course['title']; ?></h2>
                <p><?php echo $course['description']; ?></p>
                <p>Duration: <?php echo $course['duration']; ?></p>
                <p>Category: <?php echo $course['category']; ?></p>
            </div>
            <?php
        }
        ?>
    </div>
</body>
</html>
