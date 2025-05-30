import { useState } from "react";
import { trpc } from "../utils/trpcClient.js";

function LandingPage() {
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const utils = trpc.useUtils();
  const list = trpc.list.getAll.useQuery(
    { page },
    {
      onError: (error) => {
        alert(`Failed to load submissions: ${error.message}`);
      },
    }
  );

  const submit = trpc.submission.submit.useMutation({
    onSuccess: () => {
      utils.list.getAll.invalidate();
      setText("");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      submit.mutate({ content: text });
    }
  };

  const totalPages = list.data?.totalPages || 1;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Submission App</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1"
          maxLength={255}
          placeholder="Enter text"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={submit.isLoading}
        >
          {submit.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <ul className="space-y-2">
        {list.data?.data.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            {item.content}
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center pt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
