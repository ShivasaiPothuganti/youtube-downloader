import express from 'express';
import ytdl from "ytdl-core";
import fs from "fs";
import path, { dirname } from 'path';
import FFmpeg from "fluent-ffmpeg";
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

const ffmpeg_path = ffmpegPath.path;
FFmpeg.setFfmpegPath(ffmpeg_path);
const __dirname = path.resolve();

const router = express.Router();

router.post("/getaudiodetails",async (req,res)=>{
    var details = [];
    const format =req.body.format;
    const url = req.body.url;
    const info = await ytdl.getInfo(url);
    info.formats.forEach((item,index)=>{
        if(item.hasAudio){
            const temp = {
                bitrate:item.audioBitrate,
                itag:item.itag,
                quality:item.audioQuality,
                Codec:item.audioCodec,
            }
            details.push(temp);
        }
    });
    console.log(details);
    res.status(200).json({data:details});
});

router.get("/downloadAudio/:id",(req,res)=>{
    const id = req.params.id;
    res.download(`${__dirname}/${id}.mp3`,(err)=>{
        if(err){
            console.log("error downloading");
        }
        else{
            console.log("finsihed downloading");
        }
    })
});


router.post("/downloadaudio",async (req,res)=>{
    const itag = req.body.itag;
    const url = req.body.url;
    const info = await ytdl.getInfo(url);
    const video_id = info.videoDetails.videoId;

    const audiostream = fs.createWriteStream(`${__dirname}/${video_id}.mp3`);
    console.log(req.body);
    ytdl(url,{
        filter:(format)=>{
            console.log(format.itag);
            return(
                format.itag === itag
            )
        }
    }).pipe(audiostream);

    audiostream.on('finish',()=>{
        res.status(200).send({videoId:video_id})
    })
    audiostream.on('error',()=>{
        res.status(400).json({error:true});
    })

});


export default router;