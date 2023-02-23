import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from './Card';

const Container = styled.div`
    flex: 2;
`;

export default function Recommendation(props) {
    const {tags} = props;
    const [video, setVideo] = useState([]);
    
    useEffect(() => {
        const fetchVideos = async()=>{
            const res = await axios.get(`http://localhost:5000/api/video/tag?tags=${tags}`)
            setVideo(res.data)
        };
        fetchVideos();
    }, [tags])


    return (
        <>
            <Container>
                {video.map((video)=>{
                    return <Card type="sm" key={video._id} video={video}/>
                })}
            </Container>
        </>
    )
}