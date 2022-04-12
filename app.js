const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000

app.get('/topPost', (req, res) => {
    const reqOne = axios.get('https://jsonplaceholder.typicode.com/comments');
    const reqTwo = axios.get('https://jsonplaceholder.typicode.com/posts');

    axios.all([reqOne, reqTwo]).then(axios.spread((...responses) => {
        let finalResp = [];
        const allComments = responses[0].data
        const allPosts = responses[1].data


        count = function (ary, classifier) {
            classifier = classifier || String;
            return ary.reduce(function (counter, item) {
                var p = classifier(item);
                counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
                return counter;
            }, {})
        }

        //count number of comments 
        let commentsArray = count(allComments, function (comment) {
            return comment.postId
        });

        //sorting based on number of comments
        let sortedArray = Object.entries(commentsArray).sort((a, b) => b[1] - a[1])
        sortedArray.map(item => {
            let post = allPosts.find(post => post.id == item[0])
            let resp = {
                post_id: item[0],
                post_title: post.title,
                post_body: post.body,
                total_number_of_comments: item[1]
            };
            finalResp.push(resp)
        })
        res.send(finalResp)

    })).catch(errors => {
        console.log(error);

    })

})

app.get('/search', (req, res) => {

    axios.get('https://jsonplaceholder.typicode.com/comments')
        .then(function (response) {
            const filters = req.query;
            const filteredComment = response.data.filter(user => {
                let isValid = true;
                for (key in filters) {
                    isValid = isValid && user[key] == filters[key];
                }
                return isValid;
            });
            res.send(filteredComment);

        })
        .catch(function (error) {
            console.log(error);
        })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})