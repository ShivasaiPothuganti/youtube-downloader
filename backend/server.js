import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import fs from "fs";
import path from 'path';
import FFmpeg from "fluent-ffmpeg";
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

const ffmpeg_path = ffmpegPath.path;
FFmpeg.setFfmpegPath(ffmpeg_path);
const __dirname = path.resolve();

//app config
const app = express();
app.use(express.json({}));
app.use(cors({}));
app.use(express.static('./videos'));

//routes
import video from './controllers/videocontroller.js';
import audio from './controllers/audiocontroller.js';

app.use('/video',video);
app.use('/audio',audio);

const port = process.env.PORT || 5000;


app.post("/getDetails",async (req,res)=>{
    const url = req.body.url;
    const options = await ytdl.getInfo(url);  
    const details = {
        channelName : options.videoDetails.author.name,
        thumbnail:options.videoDetails.thumbnails[1].url,
        title:options.videoDetails.title
    }
    res.status(200).json({data:details});
});





app.get("/",(req,res)=>{
    res.send("<h1>this is the home page</h1>")
});

app.listen(port,(err)=>{
    if(err){
        console.log("there is an error");
        console.log(err)
    }
    else{
        console.log("server is running on port 5000");
    }
})