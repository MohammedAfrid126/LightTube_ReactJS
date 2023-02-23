import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = (props) => {
  const { videoId } = props;
  const [comment, setComment] = useState([]);
  const { currentUser } = useSelector((state)=>state.user)

  useEffect(() => {
    const fetchComment = async() =>{
      try {
        const res = await axios.get('http://localhost:5000/api/comment/63e5f3455361d69d6f59fb77')
        setComment(res.data);
      } catch (error) {
        
      }
    }
    fetchComment();
  }, [videoId])
  
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img} />
        <Input placeholder="Add a comment..." />
      </NewComment>
      {comment.map((comment)=>{
        return <Comment key={comment._id} comment={comment}/>
      })}
    </Container>
  );
};

export default Comments;
