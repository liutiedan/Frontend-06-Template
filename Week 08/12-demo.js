const { rejects } = require("assert");
const { connect } = require("http2");
const net = require("net");
const { resolve } = require("path");

class Request {
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlenceded";
        }
        if(this.headers["Content-Type"] = "application/json")
            this.bodyText = JSON.stringify(this.body);
        else if(this.headers["Content-Type"] = "application/x-www-form-urlenceded")
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers["Content-Length"] = this.bodyText.length;
    }

    send(){
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if(connection){
                connection.write(this.toString());
            }
            else{
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data) => {
                console.log(data.toString());
                parser.receive(data.toString());
                if(parser.ifFinished){
                    resolve(parser.response);
                    connection.end();
                }
            });
            connection.on('error', err => {
                reject(err);
                connection.end();
            })
        });
    }
    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
        ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\r
        ${this.bodyText}`
    }
}

class ResponseParser {
    constructor(){

    }
    receive(string){
        for(let i = 0; i < string.length; i++){
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        
    }
}

void async function(){
    let request = new Request({
        method: 'POST',
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "tiedan"
        }
    });

    let response = await request.send();

    console.log(response);
}