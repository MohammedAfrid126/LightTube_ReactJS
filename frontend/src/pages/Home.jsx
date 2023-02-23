import axios from "axios";
import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = (props) => {
  const {type} = props;
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchVideos = async() =>{
      const res = await axios.get(`http://localhost:5000/api/video/${type}`,{withCredentials : true});
      setVideos(res.data)
    }
    fetchVideos();
    // eslint-disable-next-line
  }, [type])
  
  return (
    <Container>
      {
        videos.map((video)=>(
          <Card key={video._id} video={video} />
        ))
      }
    </Container>
  );
};

export default Home;
