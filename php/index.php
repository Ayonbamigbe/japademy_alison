<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Listing</title>
    <style>
        /* CSS styles for the course div */
        .course {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            width: 45%; /* Adjust as needed */
            display: inline-block;
            vertical-align: top;
        }

        .course h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
        }

        .course p {
            font-size: 16px;
            color: #666;
            line-height: 1.5;
        }

        .course p.duration {
            font-weight: bold;
        }

        .course p.category {
            color: #999;
        }
    </style>
</head>
<body>
    <?php
        $accessToken = 'your_access_token'; // Replace with your actual access token

        // Fetch courses
        function fetchCourses($accessToken) {
            $url = 'https://alison.com/api/external/v1/courses';
            $headers = array(
                'Authorization: Bearer ' . $accessToken
            );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);

            return json_decode($response, true)['data'];
        }

        // Filter courses
        function filterCourses($courses) {
            $filteredCourses = array_filter($courses, function($course) {
                $categoryCode = strtolower($course['categories'][0]['code']);
                return strpos($categoryCode, 'health') !== false ||
                       strpos($categoryCode, 'tech') !== false ||
                       strpos($categoryCode, 'it') !== false ||
                       strpos($categoryCode, 'digital marketing') !== false;
            });
            return $filteredCourses;
        }

        // Fetch and filter courses
        $courses = fetchCourses($accessToken);
        $filteredCourses = filterCourses($courses);

        // Display courses
        foreach ($filteredCourses as $course) {
            echo '<div class="course">';
            echo '<h2>' . $course['title'] . '</h2>';
            echo '<p>' . $course['description'] . '</p>';
            echo '<p class="duration">Duration: ' . $course['duration'] . '</p>';
            echo '<p class="category">Category: ' . $course['categories'][0]['name'] . '</p>';
            echo '</div>';
        }
    ?>
</body>
</html>
