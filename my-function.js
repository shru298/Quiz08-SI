//Quiz 09 my-fucntion code 
app.get('/say', function(req, res) {
    //Define base aws url
    let queryObject = url.parse(req.url, true).search;
    let apiUrl = "";
    if(queryObject!=null){
        apiUrl='https://t9qcqaqs37.execute-api.us-east-1.amazonaws.com/test/say' + queryObject; }
    else
        apiUrl='https://t9qcqaqs37.execute-api.us-east-1.amazonaws.com/test/say';
   //call api and return response
   axios.get(apiUrl)
 
   .then(response => {
       console.log("test" +response.data);
      res.send(response.data)
    })
    .catch(err => res.json({ error: err }))
 })
 