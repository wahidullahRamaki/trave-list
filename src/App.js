import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: true },
// ];

export default function App() {
  const [items, setItems] = useState([]);
  function handleAdditems(item) {
    setItems((items) => [...items, item]);
  }

  function handlDeletItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggelItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // function handleClearList() {
  //   const confirmed = window.confirm("Are you sure to clear list");
  //   if (items != []) if (confirmed) setItems([]);
  // }
  function handleClearList() {
    // Check if items array is not empty before showing confirmation
    if (items.length > 0) {
      const confirmed = window.confirm(
        "Are you sure you want to clear the list?"
      );
      if (confirmed) {
        setItems([]);
      } else {
        window.confirm("There are no items in the list.");
      }
    }
  }

  return (
    <div className="app">
      <Logo />
      <Form onAdditems={handleAdditems} />
      <PackingList
        items={items}
        onDeleteItem={handlDeletItem}
        onToggelItem={handleToggelItem}
        handleClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1> 🌴 For Away 💼</h1>;
}

function Form({ onAdditems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    // console.log(newItem);

    onAdditems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>what do you need for your 😍 trip ?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder=" item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItem, onToggelItem, handleClearList }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItem;
  if (sortBy === "input") sortedItem = items;
  if (sortBy === "description")
    sortedItem = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItem = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItem.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggelItem={onToggelItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description </option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={handleClearList}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggelItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggelItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.description} {item.quantity}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start Adding some Item too your packing list🗂</em>
      </p>
    );

  const sumItems = items.length;
  const sumPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((sumPacked / sumItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You Got Everything! Ready TO Go ✈"
          : `  💼 you have ${sumItems} item in your list, and you have already packed
        ${sumPacked}(${percentage}%)`}
      </em>
    </footer>
  );
}
