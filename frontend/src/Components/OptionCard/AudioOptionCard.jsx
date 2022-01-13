
import React from 'react'
import axios from '../../axios.js'
import {
    Card,
    Typography,
    CardActionArea,
    Button
}from '@mui/material';

function AudioOptionCard(props) {

        /*
            itag = {ele.itag}
            bitrate = {ele.bitrate}
            quality = {ele.quality}
            codec = {ele.codec}
        */
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
            props.setloading(true);
            props.setvisible(false);
            console.log(e);
            axios.post("/audio/downloadaudio",{itag:props.itag,url:props.url},{
                headers:{
                    'content-type':'application/json'
                }
            })
            .then((data)=>{
                props.setloading(false);
                props.setvisible(true);
                const url = data.data.videoId;
                const test = `${"https://ytdlbackend.herokuapp.com"}/audio/downloadAudio/${url}`;
                window.open(test);
            })
            .catch((err)=>{
                alert("error");
            })
        }
    return (
        <div style={{
            display:'inline-block',
            marginLeft:'1rem',
            marginTop:'1rem'
        }} >
            <Button
                style = {{
                    backgroundColor : '#516BEB',
                    color:'white'
                }}
                onClick={submitdetails}
                
            >
                        
                    <Typography variant='p' style={{
                        fontWeight:'600',
                        
                    }}>
                        {props.bitrate}
                    </Typography>
                    <Typography variant='p' style={{
                        fontWeight:'400',
                        
                    }}>
                        Kbps
                    </Typography>        
            </Button>
        </div>
    )
}

export default AudioOptionCard
