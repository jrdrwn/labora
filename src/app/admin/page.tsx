export default function AdminPage() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-99999 h-16 border-b-2">
        <div className="flex h-full w-full items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Labora</h1>
          <div className="flex items-center gap-4">
            <a
              href="/admin/login"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Login
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
