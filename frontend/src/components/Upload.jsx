import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    width:87%;
    height:100%;
    position:absolute;
    top:0;
    background-color:rgba(5,5,5,0.6);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index: 1;
`
const Wrapper = styled.div`
    width:600px;
    height:600px;
    background-color:${({ theme }) => theme.bgLighter};
    color:${({ theme }) => theme.text};
    padding:20px;
    display:flex;
    flex-direction:column;
    gap: 20px;
    position: relative;
`
const Close = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`
const Title = styled.h1`
    text-align: center;
`

const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius : 3px;
    padding:10px;
    background-color: transparent;
`

const Desc = styled.textarea`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius : 3px;
    padding:10px;
    background-color: transparent;
`

const Button = styled.button`
    border-radius : 3px;
    border: none;
    padding:10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
`

const Label = styled.label`
    font-size: 14px;
`

export default function Upload(props) {

    const navigate = useNavigate();

    const { setOpen } = props;

    const [image, setImage] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(undefined);
    const [videoPercent, setVideoPercent] = useState(undefined);

    const [input, setInput] = useState({});
    const [tags, setTags] = useState([])

    const handleTags = (e) => {
        setTags(e.target.value.split(','));
    }
    
    const handleChange = (e) => {
        setInput((previousValues) => {
            return { ...previousValues, [e.target.name]: e.target.value }
        })
    }
    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "videoUrl" ? setVideoPercent(Math.floor(progress)) : setImagePercent(Math.floor(progress))
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                        }
                    },
                    (error) => { },
                    () => {
                        // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setInput((previousValues) => {
                            return { ...previousValues, [urlType]: downloadURL }
                        });
                    });
                }
            )
        }
        
        useEffect(() => {
            video && uploadFile(video, "videoUrl")
            // eslint-disable-next-line 
        }, [video])

        useEffect(() => {
            image && uploadFile(image, "imgUrl")
            // eslint-disable-next-line 
        }, [image])
        
        const handleUpload = async(e) => {
            e.preventDefault();
            try {
                const res = await axios.post('http://localhost:5000/api/video', {...input,tags} ,{headers: {Authorization: 'Bearer' },withCredentials : true})
                setOpen(false)
                navigate(`/video/${res.data._id}`)
            } catch (error) {
                console.log(error);
            }
        }

    return (
        <>
            <Container>
                <Wrapper>
                    <Close onClick={() => setOpen(false)}>X</Close>
                    <Title>Upload a New Video</Title>
                    <Label>Video:</Label>
                    {videoPercent > 0 ? ("Uploading " + videoPercent + "%") : (<Input type="file" accept='video/*' onChange={(e) => setVideo(e.target.files[0])} />)}
                    <Input type="text" placeholder='Title' name='title' onChange={handleChange} />
                    <Desc placeholder="Description" rows={8} name='desc' onChange={handleChange} />
                    <Input type="text" placeholder='Separate the tags with commas.' onChange={handleTags} />
                    <Label>Image:</Label>
                    {imagePercent > 0 ? ("Uploading " + imagePercent + "%") : (<Input type="file" accept='image/*' onChange={(e) => setImage(e.target.files[0])} />)}
                    <Button onClick={handleUpload}>Upload</Button>
                </Wrapper>
            </Container>
        </>
    )
}
