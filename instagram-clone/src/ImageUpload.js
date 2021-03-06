import React , { useState } from 'react';           
import {Button} from '@material-ui/core';
import {db , storage} from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';


function Imageupload({username}) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function..
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside db
                    db.collection("posts").add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl : url,
                        username : username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);

                });
            }
        );
    };

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input className="imageupload__input__text" type="text" placeholder="Enter a caption" onChange={event => setCaption(event.target.value)} value={caption}/>
            <input className="imageupload__input__file" type="file" onChange={handleChange}/>
            <Button className="imageupload__input__burron" onClick={handleUpload} disabled={!image}>
                Upload
            </Button>
        </div>
    );
}

export default Imageupload;
