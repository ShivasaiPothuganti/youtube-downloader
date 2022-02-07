import express from 'express';
import ytdl from "ytdl-core";
import fs from "fs";
import path, { dirname } from 'path';
import FFmpeg from "fluent-ffmpeg";
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
const ffmpeg_path = ffmpegPath.path;
FFmpeg.setFfmpegPath(ffmpeg_path);
import findRemoveSync from 'find-remove';
const __dirname = path.resolve();

const router = express.Router();


router.post("/getFormats",async (req,res)=>{
    console.log("post recieved")
    var new_details = [];
    var details =[];
    const url = req.body.url;

    const info = await ytdl.getInfo(url);
   info.formats.forEach((item,index)=>{
        if(item.container==='mp4'){
            if(item.hasVideo==true && item.hasAudio){
                const temp = {
                    itag:item.itag,
                    qualityLabel:item.qualityLabel,
                    fps:item.fps,
                    quality:item.quality,
                    audio:item.hasAudio,
                    video:item.hasVideo
                }
                details.push(temp);
            }
        }
   });
    info.formats.forEach((item,index)=>{
        if(item.container==='mp4'){
            if(item.hasVideo==true){
                const temp = {
                    itag:item.itag,
                    qualityLabel:item.qualityLabel,
                    fps:item.fps,
                    quality:item.quality,
                    audio:item.hasAudio,
                    video:item.hasVideo
                }
                details.push(temp);
            }
        }
    });
   new_details = details.filter((value,index,self)=>{
       return(
        index===self.findIndex((it)=>{
            return(
                it.qualityLabel === value.qualityLabel
            )
        })
       )
   });
    res.status(200).json({data:new_details});
});

router.post("/downloadVideoOnly",async (req,res)=>{
    console.log("video only reuest recied");
    const url = req.body.url;
    const itag = req.body.itag;
    const info = await ytdl.getInfo(url);

    const video_id = info.videoDetails.videoId;

    const fileName = fs.createWriteStream(`./${video_id}.mp4`);
    ytdl(url,{
        filter:(format)=>{
            console.log(format.itag);
            return(format.itag == itag)
        }
    }).pipe(fileName);

    fileName.on('finish',()=>{
        console.log("finished");
        res.status(200).json({videoId:video_id});
    })
    fileName.on('error',(err)=>{
        console.log(err);
        res.status(400).json({error:true});
    })
});

router.post("/downloadBothFiles",async (req,res)=>{
    console.log("this supposed to get executed once");
    const url = req.body.url;
    const itag = req.body.itag;
    const info = await ytdl.getInfo(url);
    console.log(req.body);
    const video_id = info.videoDetails.videoId;

    const fileName = fs.createWriteStream(`./${video_id}.mp4`);
    const audio = fs.createWriteStream(`./${video_id}.mp3`);

    ytdl(url,{
        filter:(format)=>{
            return(format.itag === itag)
        }
    }).pipe(fileName);

    ytdl(url,{
        filter:((format)=>{
            return(
                format.hasAudio === true
            )
        })
    }).pipe(audio);

    

    fileName.on('finish',()=>{
        audio.on('finish',()=>{
            console.log("finshed downladig both files");
            const video_source = path.join(__dirname,`${video_id}.mp4`);
            const audio_source = path.join(__dirname,`${video_id}.mp3`);
            const mergedfile = new FFmpeg({
                source:video_source
            })

            mergedfile.addInput(audio_source);
            mergedfile.on('start',()=>{
                console.log("started mergin");
            })
            mergedfile.saveToFile(`${__dirname}/new${video_id}.mp4`);
            mergedfile.on('end',()=>{
                fs.unlink(`${__dirname}/${video_id}.mp4`,(err)=>{
                    if(err){
                        res.status(200).json({unlink:false});
                    }
                    else{
                        fs.unlink(`${__dirname}/${video_id}.mp3`,(err)=>{
                            if(err){
                                res.status(200).json({unlink:false});
                            }
                            else{
                                console.log("finished mergin");
                                res.status(200).json({videoId:video_id});
                            }
                        })
                    }
                });

                
            })
            mergedfile.on('error',(err)=>{
                res.status(400).json({messgae:'error'});
                console.log("there is an error");
                console.log(err);
            })
        });
        audio.on('error',()=>{
            res.status(400).json({videoId:video_id});
        })
    });

    fileName.on('error',()=>{
        res.status(400).json({message:'error'});
    });
});


router.get("/downloadMergedVideo/:id",(req,res)=>{
    const video_id = req.params.id;
    res.download(path.join(__dirname,`new${video_id}.mp4`),`new${video_id}.mp4`,(err)=>{
        if(err){
            console.log("there is an error");
        }
        else{
            console.log("download started");
        }
    })
});

router.get("/downloadVideo/:id",(req,res)=>{
    const video_id = req.params.id;
    res.download(path.join(`${__dirname}/${video_id}.mp4`),`${video_id}.mp4`,(err)=>{
        if(err){
            console.log("there is an error ")
        }
        else{
            console.log("download started succesfully");
        }
    })
});

router.get('/deleteAllVideos',(req,res)=>{
    console.log("i am recieving request");
    var result = findRemoveSync(`${__dirname}`, {
        age: { seconds: 3600 },
        extensions: ['.mp4','.mp3'],
        limit: 100
      });

    res.status(200).json({deleted:true});
})

export default router;