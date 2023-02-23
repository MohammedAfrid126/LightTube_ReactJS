import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Card from '../components/Card'

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap : 10px;
`

export default function Search() {

    const query = useLocation().search;
    const [video, setVideo] = useState([])

    useEffect(() => {
        const fertchVideo = async () =>{
        const res = await axios.get(`http://localhost:5000/api/video/search${query}`)
        setVideo(res.data)
    }
    fertchVideo();
    }, [query])
    
    return (
        <>
            <Container>
                {video.map((video)=>{
                    return <Card key={video._id} video={video}/>
                })}
            </Container>
        </>
    )
}
