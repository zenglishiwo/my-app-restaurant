import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [category, setCategory] = useState({
    isFetching: false,
    data: [],
    err: null
  });
  const [item, setItem] = useState({
    isFetching_item: false,
    data_item: [],
    err_item: null
  });
  const [head, setHead] = useState("");
  const { isFetching, data, err } = category;
  const { isFetching_item, data_item, err_item } = item;

  useEffect(() => {
    setCategory((prev) => {
      return {
        ...prev,
        isFetching: true,
        data: [],
        err: null
      };
    });
    axios
      .get("http://stream-menu-svc-v3.herokuapp.com/category")
      .then((response) => {
        setCategory((prev) => {
          return {
            ...prev,
            isFetching: false,
            data: response,
            err: null
          };
        });
      })
      .catch((error) => {
        setCategory((prev) => {
          return {
            ...prev,
            isFetching: false,
            data: [],
            err: error
          };
        });
      });
  }, []);

  const handleClick = (e) => {
    // console.log(e.target.innerText)

    setItem((prev) => {
      return {
        ...prev,
        isFetching_item: true,
        err_item: null
      };
    });
    axios
      .get(`http://stream-menu-svc-v3.herokuapp.com/item?category=${e}`)
      .then((response) => {
        setHead(e);
        setItem((prev) => {
          return {
            ...prev,
            isFetching_item: false,
            data_item: response,
            err_item: null
          };
        });
      })
      .catch((error) => {
        setItem((prev) => {
          return {
            ...prev,
            isFetching_item: false,
            data_item: [],
            err_item: error
          };
        });
      });
  };

  return (
    <div className="container">
      <h2>Menu Categories</h2>
      {isFetching
        ? "Loading the data...."
        : err
          ? "This was an error to get the data."
          : data.data &&
          <div className="category">
            {data.data.map((e, i) => (

              <ul>
                <li
                  onClick={() => handleClick(e.short_name)}
                >{`${e.name} - (${e.short_name})`}</li>
              </ul>

            ))}
          </div>}

      {data_item.data && (
        <div className="item">
          <h2>Items in Category: ({head})</h2>
          <table className="table-item-container">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data_item.data &&
                data_item.data.map((e, i) => (
                  <tr key={i}>
                    <td>{e.name}</td>
                    <td>{e.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
