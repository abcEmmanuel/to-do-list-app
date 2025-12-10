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

    if (error) {
      console.error('Insert error', error);
      alert('Failed to add todo: ' + (error.message || 'Unknown error'));
    } else if (data && data.length > 0) {
      setTodos((t) => [data[0], ...t]);
      setNewTodo('');
    } else {
      console.warn('No data returned from insert');
      // Refresh the list from server
      fetchTodos();
    }

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
        <div className="header">
          <h1>✓ My Tasks</h1>
          <p className="subtitle">Stay organized and productive</p>
        </div>

        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="btn-add">
            {loading ? 'Adding...' : '+ Add'}
          </button>
        </form>

        {loading && <div className="loading-spinner">Loading…</div>}

        <ul className="todo-list">
          {todos.length === 0 && !loading && (
            <li className="empty-state">
              <p>📝 No tasks yet</p>
              <p className="hint">Add one to get started!</p>
            </li>
          )}
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!!todo.done}
                  onChange={() => toggleDone(todo)}
                  className="checkbox"
                />
                <span className="checkmark"></span>
                <span className="content">{todo.content}</span>
              </label>
              <button 
                className="btn-delete" 
                onClick={() => deleteTodo(todo.id)}
                title="Delete task"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer">
        <p>Built with Next.js + Supabase • Hosted on Vercel</p>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        main {
          flex: 1;
          max-width: 700px;
          width: 100%;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 20px;
        }

        h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .subtitle {
          color: #999;
          font-size: 14px;
          font-weight: 500;
        }

        .add-form {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .add-form input {
          flex: 1;
          padding: 14px 16px;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }

        .add-form input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .add-form input:disabled {
          background: #f9f9f9;
          color: #ccc;
        }

        .btn-add {
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-add:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-add:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-add:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          text-align: center;
          padding: 20px;
          color: #667eea;
          font-weight: 600;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .todo-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .todo-item:hover {
          background: #f5f5f5;
          border-color: #e8e8e8;
        }

        .todo-item.done {
          opacity: 0.6;
          background: #f0f0f0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          cursor: pointer;
          user-select: none;
        }

        .checkbox {
          display: none;
        }

        .checkmark {
          width: 24px;
          height: 24px;
          border: 2px solid #e8e8e8;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .checkbox:checked + .checkmark {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
        }

        .checkbox:checked + .checkmark::after {
          content: '✓';
          font-weight: bold;
          font-size: 14px;
        }

        .content {
          font-size: 15px;
          color: #333;
          word-break: break-word;
        }

        .todo-item.done .content {
          text-decoration: line-through;
          color: #999;
        }

        .btn-delete {
          background: transparent;
          border: none;
          color: #ccc;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-delete:hover {
          color: #ff6b6b;
          background: #ffe0e0;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .empty-state p {
          margin: 8px 0;
          font-size: 18px;
        }

        .empty-state p:first-child {
          font-size: 32px;
        }

        .hint {
          font-size: 14px;
          color: #bbb;
        }

        .footer {
          text-align: center;
          padding: 20px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
        }

        @media (max-width: 600px) {
          main {
            padding: 24px;
            border-radius: 16px;
          }

          h1 {
            font-size: 2rem;
          }

          .add-form {
            gap: 8px;
          }

          .add-form input,
          .btn-add {
            padding: 12px;
            font-size: 14px;
          }

          .todo-item {
            padding: 12px;
          }

          .checkbox-label {
            gap: 10px;
          }

          .checkmark {
            width: 20px;
            height: 20px;
          }

          .content {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
