

import React,{useState} from 'react';
import {
    Grid,
	Typography,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
    Box,
    CircularProgress
} from '@mui/material';
import axios from "../../axios.js"
import { height } from '@mui/system';
import VideoOptionsCard from '../OptionCard/VideoOptionsCard.jsx';
import AudioOptionCard from '../OptionCard/AudioOptionCard.jsx';



function VideoCard(props) {
    const button_styles = {
        backgroundColor:'#516BEB',
        color:'white'
    }
    const [Easyvideoset, setvideoset] = useState([]);
    const [hardVideoSet, sethardVideoSet] = useState([])
    const [audioset, setaudioset] = useState([]);
    const [loading,setLoading] = useState(false);
    const [visible,setVisible] = useState(false);


    const [em,setem] = useState("");
    const [hm,sethm] = useState("");

    const [reqLoading,setRequestLoading] = useState(false);

    const download = (e)=>{
        setLoading(true);
        setVisible(false);
        setaudioset([]);
        const format = e.target.name;
        console.log("post sent");
        axios.post("/video/getFormats",{url:props.url,format:format},{
            headers:{
                'content-type':'application/json'
            }
        })
        .then((data)=>{
            console.log(data);
            
            const video_set = data.data.data;
            const easy_set = video_set.filter((item)=>{
                return(
                    item.audio && item.video
                )
            });

            const hard_set = video_set.filter((item)=>{
                return(
                    item.video && !item.audio
                )
            });

            sethardVideoSet(hard_set);
            setvideoset(easy_set);

            setLoading(false);
            setVisible(true);
        })
        .catch((err)=>{
            setLoading(false);
            setVisible(false);
            alert('error');
        })
    }


    const downloadmp3 = (e)=>{
        setLoading(true);
        setVisible(false);
        setvideoset([]);
        sethardVideoSet([]);
        const format = e.target.name;
        axios.post("/audio/getaudiodetails",{url:props.url,format:format},{
            headers:{
                'content-type':'application/json'
            }
        })
        .then((data)=>{
            setaudioset(data.data.data);
            console.log(audioset);
            setLoading(false);
            setVisible(true);
        })
        .catch((err)=>{
            alert("this is an mp3 error")
        })
    }

    return (
        <Box 
            sx = {{
                width:'100vw',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'column'
            }}
        className='videoCard' id='videoCard'>
            <Box
                sx={{
                    width:'100vw',
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'column'
                }}
            >
                <Card
                    sx={{
                        display:'flex',
                        flexDirection:{
                            lg:'row',
                            sm:'column',
                            xs:'column'
                        },
                        width:{
                            lg:'50%',
                            md:'50%',
                            sm:'50%',
                            xs:'100%'
                        },
                    }}
                >
                    <Box sx={{display:'flex',margin:'7px',flexDirection:{
                            lg:'row',
                            md:'column',
                            sm:'column',
                            xs:'column'
                        },}}>
                        <CardMedia
                            component="img"
                            sx = {{
                                width:{
                                    lg:150,
                                    md:'100%',
                                    sm:'100%',
                                    xs:'100%'
                                },
                                height:150,
                                borderRadius:'10px',
                                pr:3,
                                backgroundSize:'cover'
                            }}
                            image={props.img}
                            alt="green iguana"
                        />
                        <CardContent sx = {
                            {
                                height:'85%',
                                width:'90%',
                                display:'flex',
                                flexDirection:'column',
                                justifyContent:'space-between'
                            }
                        }>
                            <Typography gutterBottom variant="h5" component="div">
                                {props.title}
                            </Typography>
                            <Typography marginBottom = {'10px'} variant="body2" color="text.secondary">
                                {props.channelName}
                            </Typography>
                            <Grid container spacing={{
                                xs: 4, sm: 3, md: 3,
                                lg:8
                            }}>
                                <Grid item>
                                    <Button onClick={download} name='mp4' style={button_styles} >
                                        Download mp4
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={downloadmp3} name='mp3' style={button_styles}>
                                        Download mp3
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Box>
                </Card>
            </Box>
            {
                loading ? 

                    <Grid display={'flex'} height={'14vh'} alignItems={'center'} justifyContent={'center'}  marginTop={{
                        lg:'10vh',
                        md:'7vh',
                        sm:'5vh',
                        xs:'3vh'
                    }} >
                        
                        {em===""? null:<Typography variant={'p'}>{em}</Typography>}
                        {hm===""? null: <Typography variant={'p'} >{hm}</Typography>}
                        <br/>
                        <CircularProgress />
                    </Grid> :
                visible ?
                <Typography
                marginTop = '10vh'
                fontSize={{
                    lg:'1.6rem',
                    md:'1.4rem',
                    sm:'1.4rem',
                    xs:'1.4rem'
                }}
                pl={{
                    lg:'0',
                    md:'50px',
                    sm:'50px',
                    xs:'50px'
                }}
                variant='h4'
                style={{
                    color:'black'
                }}
                >
                Please select one of the given format to download
                </Typography>:
                null
            }
            {
                visible?
                Easyvideoset.length!==0 || hardVideoSet.length!==0?
                <Box
                    height="30vh"
                    width={'90vw'}
                    className="container"
                    display={'flex'}
                    marginTop={'10vh'}
                    justifyContent={'space-evenly'}
                    flexWrap={'wrap'}
                >
                <Box width={'40rem'} className="left">
                    <Typography variant="p" fontSize={{
                        lg:'1.4rem',
                        md:'1.2rem',
                        sm:'1rem',
                        xs:'.8rem'
                    }}>
                        These formats takes less time to download
                    </Typography>
                    <br/>
                    {
                        Easyvideoset.map((ele)=>{
                            return(
                                <VideoOptionsCard
                                    url={props.url}
                                    itag = {ele.itag}
                                    qualityLabel={ele.qualityLabel}
                                    setloading={setLoading}
                                    setvisible={setVisible}
                                    em={setem}
                                    hm={sethm}
                                    state={"easy"}
                                />
                            )
                        })
                    }
                    
                </Box>
                <Box width={'40rem'}  className="right">
                    <Typography variant="p" fontSize={{
                        lg:'1.4rem',
                        md:'1.2rem',
                        sm:'1rem',
                        xs:'.8rem'
                    }}>
                        These formats take more than 30 min to start downloading
                    </Typography>
                    <br/>
                    {
                        hardVideoSet.map((ele)=>{
                            return(
                                <VideoOptionsCard
                                    url={props.url}
                                    itag = {ele.itag}
                                    qualityLabel={ele.qualityLabel}
                                    setloading={setLoading}
                                    setvisible={setVisible}
                                    em={setem}
                                    hm={sethm}
                                    state={"hard"}
                                />
                            )
                        })
                    }
                </Box>
            </Box>:null:null
            }
            {
                visible?
                
                    audioset.length !==0?
                    <Box
                        width={'40vw'}
                        className="container"
                        display={'flex'}
                        flexDirection={'column'}
                        marginTop={'10vh'}
                        justifyContent={'space-evenly'}
                        flexWrap={'wrap'}
                    >
                        <Typography  variant="p" color={'black'} fontSize={{
                            lg:'1.4rem',
                            md:'1.2rem',
                            sm:'1rem',
                            xs:'.8rem'
                        }} >
                            Choose a format from below
                        </Typography>
                        <br/>
                        <Box>
                        {
                            audioset.map((ele)=>{
                                return(
                                    <AudioOptionCard
                                        bitrate = {ele.bitrate}
                                        itag = {ele.itag}
                                        url = {props.url}
                                        setloading={setLoading}
                                        setvisible={setVisible}
                                        em={setem}
                                        hm={sethm}
                                    />
                                )
                            })
                        }
                        </Box>
                    </Box>:null
                :null
            }
        </Box>
    )
}

export default VideoCard;