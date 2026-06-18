export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-7xl font-bold text-slate-800">404</h1>

      <p className="mt-4 text-2xl font-semibold text-slate-700">
        Page Not Found
      </p>

      <p className="mt-2 text-slate-500">
        The page you are looking for doesn't exist.
      </p>

      <a
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
}
