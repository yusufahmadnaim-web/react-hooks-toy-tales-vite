import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const TOYS_URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch(TOYS_URL)
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error("Error loading toys:", error));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function addToy(toy) {
    fetch(TOYS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...toy, likes: 0 }),
    })
      .then((response) => response.json())
      .then((newToy) => {
        setToys((currentToys) => [...currentToys, newToy]);
        setShowForm(false);
      })
      .catch((error) => console.error("Error creating toy:", error));
  }

  function likeToy(toy) {
    const updatedToy = { ...toy, likes: toy.likes + 1 };

    fetch(`${TOYS_URL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedToy.likes }),
    })
      .then((response) => response.json())
      .then((savedToy) => {
        setToys((currentToys) =>
          currentToys.map((currentToy) =>
            currentToy.id === savedToy.id ? savedToy : currentToy
          )
        );
      })
      .catch((error) => console.error("Error updating likes:", error));
  }

  function deleteToy(id) {
    fetch(`${TOYS_URL}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete toy");
        }
        setToys((currentToys) =>
          currentToys.filter((toy) => toy.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting toy:", error));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={addToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={likeToy} onDelete={deleteToy} />
    </>
  );
}

export default App;
