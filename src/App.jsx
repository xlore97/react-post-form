import { useState } from "react";
import axios from "axios";
import "./App.css";

const INITIAL_FORM = {
  author: "",
  title: "",
  body: "",
  public: false,
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const isValid =
    form.author.trim() && form.title.trim() && form.body.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!isValid) {
      setAlert({ type: "error", message: "Compila tutti i campi." });
      return;
    }

    try {
      setLoading(true);
      setAlert({
        type: "success",
        message: `Invio in corso... Il post sarà ${form.public ? "PUBBLICO" : "PRIVATO"
          }.`,
      });

      const res = await axios.post(
        "https://67c5b4f3351c081993fb1ab6.mockapi.io/api/posts",
        form
      );

      console.log("✅ Dati inviati:", res.data);

      setAlert({ type: "success", message: "Post inviato correttamente!" });
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "❌ Errore nell'invio, riprova.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postContainer">
      <h2>Crea un nuovo post</h2>

      {alert && (
        <div role="alert" className={alert.type}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="formContainer"
          type="text"
          placeholder="Author"
          name="author"
          value={form.author}
          onChange={handleFormData}
        />

        <input
          className="formContainer"
          type="text"
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleFormData}
        />

        <textarea
          className="formContainer"
          rows="7"
          placeholder="Body"
          name="body"
          value={form.body}
          onChange={handleFormData}
        />

        <label className="checkboxLabel">
          <input
            className="inputCheck"
            type="checkbox"
            name="public"
            checked={form.public}
            onChange={handleCheckbox}
          />
          Pubblico
        </label>

        <button type="submit" disabled={!isValid || loading}>
          {loading ? "Invio..." : "Invia"}
        </button>
      </form>
    </div>
  );
}
