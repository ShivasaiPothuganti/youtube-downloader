


import React,{useState} from 'react';
import {Card,Typography,CardActionArea,Button} from '@mui/material';
import axios from '../../axios';
import FileSaver from 'file-saver';

function VideoOptionsCard(props) {
    const card_styles = {
        
            display:'flex',
            height:'250px',
            width:'250px',
            justifyContent:'center',
            alignItems:'center',
            boxShadow:'inset 4px 4px 4px #e7e7e7',
            margin:'20px'
            
    }
    const submitdetails = (e)=>{
        console.log(props);
        props.setloading(true);
        props.setvisible(false);
        
        if(props.state==="easy"){
            props.em("downloading the  file this might take a while")
            console.log("i am in easy section")
            axios.post("/video/downloadVideoOnly",{url:props.url,itag:props.itag},{
                headers:{
                    'content-type':'application/json'
                }
            })
            .then((data)=>{
                const video_id = data.data.videoId;
                console.log(video_id);
                props.em("");
                const test = "https://ytdlbackend.herokuapp.com"+"/video/downloadVideo/"+video_id;
                window.open(test);
                props.setloading(false);
                props.setvisible(true);
            })
            .catch(()=>{
                console.log("error");
            })
        }
        else{
            props.hm("The download takes several minutes to start");
            console.log("i am in hard section");
            axios.post("/video/downloadBothFiles",{url:props.url,itag:props.itag},{
                headers:{
                    'content-type':'application/json'
                }
            })
            .then((data)=>{
                const video_id = data.data.videoId;
                const test = `${"https://ytdlbackend.herokuapp.com"}/video/downloadMergedVideo/${video_id}`
                window.open(test);
                props.setloading(false);
                props.hm("");
                props.setvisible(true);
            })
            .catch((err)=>{
                console.log("error with both files");
            })
        }
    }
    return (
        <div style={{display:'inline-block'}}>
                <Button
                    onClick={submitdetails}
                    sx={{
                        height:'100%',                    
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',
                        boxShadow:'inset -2px -2px 4px #e7e7e7',
                        backgroundColor:'#516BEB',
                        color:'white',
                        '&:hover': {
                            background: "#516BEB",
                        },
                        marginLeft:'1rem'
                    }}
                >
                    <Typography variant='p' style={{
                        fontWeight:'600'
                    }}>
                        {props.qualityLabel}
                    </Typography>
                </Button>
            
        </div>
    )
}

export default VideoOptionsCard;
