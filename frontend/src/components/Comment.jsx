import axios from "axios";
import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { commentFailure, commentStart, commentSuccess } from "../redux/commentSlice";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const ButtonDelete = styled.span`
  background-color: #3d3837;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`

const Comment = ({comment}) => {
  const [channel, setChannel] = useState({})
  const dispatch = useDispatch();

  useEffect( () => {
    const fetchComment =async()=> {
      const channelResp = await axios.get(`http://localhost:5000/api/user/find/${comment.userId}`)
      setChannel(channelResp.data);
      }
      fetchComment();
  }, [comment.userId])

  const handleDelete = async(e) => {
    dispatch(commentStart())
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:5000/api/comment/${comment._id}`,{headers: {Authorization: 'Bearer'},withCredentials : true})
      // let commentAfterDelete = comment.filter(comment => comment._id !== comment);
      dispatch(commentSuccess(comment._id))
    } catch (error) {
      dispatch(commentFailure(error))
      console.log(error);
    }
  }
  
  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date>{moment(comment?.createdAt).fromNow()}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
      <ButtonDelete onClick={handleDelete}>
        Delete
      </ButtonDelete>
    </Container>
  );
};

export default Comment;
