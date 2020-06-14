import React, { useState } from "react";
import Main from "../Components/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Components/Loading";
import Axios from "axios";

const Upload = ({ history, showError }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sendingPost, setSendingPost] = useState(false);
  const [caption, setCaption] = useState("");

  const handleImageSelecction = async (evento) => {
    try {
      setUploadingImage(true);
      const file = evento.target.files[0];

      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };

      const { data } = await Axios.post("/api/posts/upload", file, config);
      console.log(data);
      setImageUrl(data.url);
      setUploadingImage(false);
    } catch (error) {
      setUploadingImage(false);
      showError(error.response.data);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sendingPost) {
      return;
    }

    if (uploadingImage) {
      showError("No se ha termiando de subir la imagen");
      return;
    }

    if (!imageUrl) {
      showError("Selecciona una imagen");
      return;
    }

    try {
      setUploadingImage(true);
      const body = {
        caption,
        url: imageUrl,
      };
      await Axios.post("/api/posts", body);
      setSendingPost(false);
      history.push("/"); //Envia el usuario al home
    } catch (error) {
      console.log(error);
      showError(error.response.data);
    }
  };

  return (
    <Main center>
      <div className="Upload">
        <form onSubmit={handleSubmit}>
          <div className="Upload__image-section">
            <SectionUploadImage
              imageUrl={imageUrl}
              uploadingImage={uploadingImage}
              handleImageSelecction={handleImageSelecction}
            />
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            required
            maxLength="180"
            placeholder="Caption de tu post."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
};

const SectionUploadImage = ({
  uploadingImage,
  imageUrl,
  handleImageSelecction,
}) => {
  if (uploadingImage) {
    return <Loading />;
  } else if (imageUrl) {
    return <img src={imageUrl} alt="" />;
  } else {
    return (
      <label className="Upload__image-label">
        <FontAwesomeIcon icon={faUpload} />
        <span>Publica una foto</span>
        <input
          type="file"
          className="hidden"
          name="imagen"
          onChange={handleImageSelecction}
        />
      </label>
    );
  }
};

export default Upload;
