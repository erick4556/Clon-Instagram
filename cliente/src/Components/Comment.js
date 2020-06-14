import React, { useState } from "react";

const Comment = ({ onSubmitComment, showError }) => {
  const [message, setMessage] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sendingComment) {
      return;
    } else {
      try {
        setSendingComment(true);
        await onSubmitComment(message);
        setMessage(""); //Reseteo el input
        setSendingComment(false);
      } catch (error) {
        setSendingComment(false);
        showError("Hubo un problema guardando el comentario. Intenta de nuevo");
      }
    }
  };

  return (
    <form
      action=""
      className="Post__comentario-form-container"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        placeholder="Deja un comentario..."
        required
        maxLength="180"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default Comment;
