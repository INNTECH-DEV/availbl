// write me a component where I can add multiple inputs, edit them and delete them
// the component should update a state from the parent component
"use client";
const { useState, useEffect } = require("react");

// TODO: DE MODIFICAT AICI SA POTI EDITA
export const MultipleInput = ({ state, setState }) => {
  const [input, setInput] = useState("");
  const [inputs, setInputs] = useState([]);

  const handleAdd = () => {
    setInputs([...inputs, input]);
    setInput("");
  };

  const handleDelete = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  useEffect(() => {
    setState(inputs);
  }, [inputs]);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      {inputs.map((input, index) => (
        <div key={index}>
          {input}
          <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
