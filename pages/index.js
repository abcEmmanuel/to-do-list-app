import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching todos', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Supabase not configured');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('todos')
      .insert([{ content: newTodo.trim(), done: false }])
      .select();

    if (error) console.error('Insert error', error);
    else setTodos((t) => [data[0], ...t]);

    setNewTodo('');
    setLoading(false);
  }

  async function toggleDone(todo) {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }
    const { data, error } = await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', todo.id)
      .select();

    if (error) console.error('Update error', error);
    else setTodos((t) => t.map((x) => (x.id === todo.id ? data[0] : x)));
  }

  async function deleteTodo(id) {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) console.error('Delete error', error);
    else setTodos((t) => t.filter((x) => x.id !== id));
  }

  return (
    <div className="container">
      <main>
        <h1>Supabase To‑Do List</h1>

        <form onSubmit={addTodo} className="add-form">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Write a new task"
          />
          <button type="submit" disabled={loading}>Add</button>
        </form>

        {loading && <p className="muted">Loading…</p>}

        <ul className="todo-list">
          {todos.length === 0 && !loading && <li className="muted">No tasks yet.</li>}
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={!!todo.done}
                  onChange={() => toggleDone(todo)}
                />
                <span className="content">{todo.content}</span>
              </label>
              <button className="delete" onClick={() => deleteTodo(todo.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        <p className="muted">Built with Next.js + Supabase — deploy on Vercel</p>
      </footer>

      <style jsx>{`
        .container {
          max-width: 640px;
          margin: 40px auto;
          padding: 0 16px;
        }
        h1 { text-align: center; }
        .add-form { display:flex; gap:8px; margin:16px 0; }
        input[type='text'], input { flex:1; padding:8px 12px; border-radius:6px; border:1px solid #ddd }
        button { padding:8px 12px; border-radius:6px; border:1px solid #ccc; background:#fff }
        .todo-list { list-style:none; padding:0; margin:0; }
        .todo-list li { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-bottom:1px solid #f0f0f0 }
        .todo-list li.done .content { text-decoration:line-through; color:#888 }
        .delete { background:transparent; border:0; color:#c00; font-size:20px }
        .muted { color:#666; font-size:14px }
      `}</style>
    </div>
  );
}
