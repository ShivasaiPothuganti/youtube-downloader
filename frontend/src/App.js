
import React,{useState} from 'react';
import './App.css';
import axios from './axios.js';

import {
	Grid,
	Item,
	Typography,
	Input,
	TextField,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	CircularProgress
} from '@mui/material';
import VideoCard from './Components/VideoCard/VideoCard';

function App() {
	
	const [url, seturl] = useState("");
	const [videoData, setVideoData] = useState([]);
	const [clicked,setClicked] = useState(false);
	const [loading,setLoading] = useState(false);

	const handleUrl = (e)=>{
		seturl(e.target.value);
	}
	const getDetails = ()=>{
		setLoading(true);
		axios.post("/getDetails",{url:url},{
			headers:{
				'Content-Type':'application/json'
			}
		})
		.then((data)=>{
			setVideoData(data.data.data);
			setClicked(true);
			setLoading(false);
		})
		.catch((err)=>{
			alert("there is an error");
			setLoading(false);
		});
		  
	}

  return (
    <div className="app">
    	<Grid
			container
			direction="column"
			justifyContent="center"
			alignItems="center"
			height={'50vh'}
			spacing={4}
			backgroundColor={'white'}
		>	
			<Grid item>
				<Typography
					
				sx = {{
					fontSize:{
						lg: 70,
						md: 50,
						sm: 35,
						xs: 25
					},
					color:'black',
					fontWeight: '400'
				}} 
				
				>
					Youtube Video downloader
				</Typography>
			</Grid>
			<Grid width={'50%'} item>
				<TextField
					fullWidth
					onChange={handleUrl}
				variant='outlined' label="Enter the URL" />
			</Grid>
			<Grid item justifyContent='center' alignItems = 'center'  >
				<Button
					style = {
						{
							background:'#516BEB',
							color:'white'
						}
					}  
					onClick={getDetails}
				>
					Get the details
				</Button>
			</Grid>
			
		</Grid>
		{
			console.log(loading)
		}
		{
			
			clicked ? 
			loading ?
				<Grid item height={'100vh'} width={'100vw'} display={'flex'} justifyContent={'center'} ><CircularProgress/></Grid> :
			<Grid item  height={'100vh'}>
			<VideoCard 
				img={videoData.thumbnail} 
				title={videoData.title} 
				channelName = {videoData.channelName}
				url = {url}
			/>
		</Grid>:null
		}
		<div style={{
			width:'100vw',
			height:'8vh',
			backgroundColor:'#516BEB',
			display:'flex',
			justifyContent:'center',
			alignItems:'center',
			position:'fixed',
			bottom:0,
			left:0,
			color:'white'
		}}>
			<span style={{
				fontSize:'1.5rem',
				marginRight:'1rem'
			}}  >Made by</span>
			<a style={{
				fontSize:'1.5rem',
				textDecoration:'underline',
			}}
			
				onClick={()=>{
					window.open("https://github.com/ShivasaiPothuganti")
				}}
			>Shivasai</a>
		</div>
    </div>
  );
}

export default App;