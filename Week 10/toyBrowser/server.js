const http = require('http');

http.createServer((request, response)=>{
    let body = [];
    request.on('error', (err)=>{
        console.error(err);
    }).on('data', (chunk)=>{
        body.push(chunk.toString());
    }).on('end',()=>{
        body = Buffer.concat(body).toString();
        console.log('body:', body);
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(`
        <html>
           <head>
              <style>
                    body div #myid{
                        width:100px;
                        background-color:#ff500;
                    }
                </style>
           </head>
           <body>
              <div>
                  <img src="" alt="img" />
              </div>
           </body>
        </html>
    `);
    });
}).listen(8088);