const http = require('http');

const targetUrl = 'http://localhost:3000'; // Change this to your server's URL
const numberOfRequests = 1000; // Total number of requests to send
const concurrencyLevel = 100; // Number of concurrent requests

let requestsSent = 0;

const localDs = () => 
{
  http.get('/' , (res) => {
    res.on('data',()=> {
      res.on('end',()=> {
        requestsSent++;
        if(requestsSent < numberOfRequests)
        {
          localDs();
        }
      })
    })
  })
}

const localDdos = () => {
  http.get('/',(res)=> {
    res.on('data');

    res.on('end',()=> {
      requestsSent++;
      if(requestsSent < numberOfRequests){
        localDdos();
      }
    })
  }).on('error',(err)=> {
    console.error(`Error: ${err.message}`);
  })
}

const sendRequest = () => {
  http.get(targetUrl, (res) => {
    res.on('data', () => {});
    res.on('end', () => {
      requestsSent++;
      if (requestsSent < numberOfRequests) {
        sendRequest(); // Send another request if not reached the limit
      }
    });
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
};


// Start sending requests with concurrency
for (let i = 0; i < concurrencyLevel; i++) {
  sendRequest();
}
