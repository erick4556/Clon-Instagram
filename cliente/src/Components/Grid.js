import React from "react";
import { Link } from "react-router-dom";

const Grid = ({ posts }) => {
  const columns = posts.reduce((columnas, post) => {
    const lastColumn = columnas[columnas.length - 1];

    if (lastColumn && lastColumn.length < 3) {
      lastColumn.push(post);
    } else {
      columnas.push([post]);
    }

    return columnas;
  }, []); //Le paso un array vacio

  return (
    <div>
      {columns.map((columna, index) => {
        return (
          <div key={index} className="Grid__row">
            {columna.map((post) => (
              <GridPhoto key={post._id} {...post} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const GridPhoto = ({ _id, url, caption }) => {
  return (
    <Link to={`/post/${_id}/`} className="Grid__post">
      <img src={url} alt={caption} className="Grid__post-img" />
    </Link>
  );
};

export default Grid;
