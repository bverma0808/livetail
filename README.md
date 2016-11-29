# livetail
A log watching solution through web (similar to the tail -f command in UNIX)

### Prerequisites:
1. Node.Js

### How to setup:
1. Do git clone and cd into project directory
2. ```npm install```
3. ```bower install```
4. ```node app```
5. Browse to localhost:8080 in your Web Browser
   ![home page](https://s3.ap-south-1.amazonaws.com/ohsahi/s1.png)
   
6. Enter the fully qualified path for the file (local to the system where app is running) for which you want to see logs
   ![home page](https://s3.ap-south-1.amazonaws.com/ohsahi/s2.png)
   
7. Click on 'START' button to see the real time streaming of the logs 
   ![logs page](https://s3.ap-south-1.amazonaws.com/ohsahi/s3.png)
   ![logs page](https://s3.ap-south-1.amazonaws.com/ohsahi/s4.png)
   ![logs page](https://s3.ap-south-1.amazonaws.com/ohsahi/s5.png)
   
8. To stop click the 'STOP' button and the watching of file will actually be stopped and you will be redirected to home page again
   ![home page](https://s3.ap-south-1.amazonaws.com/ohsahi/s1.png)

###Next Version:
Next version would contain the option to specify the number of lines in 'tail'command
