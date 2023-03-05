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

const ButtonComment  = styled.button`
background-color: #3d3837;
font-weight: 500;
color: white;
border: none;
border-radius: 3px;
height: max-content;
padding: 10px 20px;
cursor: pointer;
`

const Comments = (props) => {
  const { videoId } = props;
  const [comment, setComment] = useState([]);
  const { currentUser } = useSelector((state)=>state.user);
  const currentComment = useSelector((state) => state.comment)
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const fetchComment = async() =>{
      try {
        const res = await axios.get(`http://localhost:5000/api/comment/${videoId}`)
        setComment(res.data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchComment();
  }, [videoId, currentComment])

  useEffect(() => {
    const updateDeletedComment = async() =>{
      try {
        const afterDelete = comment.filter(comment => comment._id !== currentComment)
        setComment(afterDelete)
      } catch (error) {
        console.log(error);
      }
    }
    updateDeletedComment();
    // eslint-disable-next-line
  }, [currentComment])
  
  const handleComment = async(e) =>{
    e.preventDefault();
    const headers = {
      "desc" : commentInput,
      videoId : videoId,
    }
    try {
      const commentData = await axios.post(`http://localhost:5000/api/comment`, headers,{withCredentials : true})
      setCommentInput("")
      setComment(comment.concat(commentData.data))
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img} />
          <Input placeholder="Add a comment..." onChange={e=>setCommentInput(e.target.value)}/>
        <ButtonComment onClick={handleComment}>Comment</ButtonComment>
      </NewComment>
      {comment.map((comment)=>{
        return <Comment key={comment._id} comment={comment} />
      })}
    </Container>
  );
};

export default Comments;
